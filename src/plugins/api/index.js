const express = require('express');
// const dotenv = require('dotenv'); // Moved into configureServer
const { generateEmbedding, getChatResponse } = require('../../lib/gemini'); // Import getChatResponse
const qdrantClient = require('../../lib/qdrant').default;
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Keep this import for GoogleGenerativeAI type if needed, though not directly used for chat here now
// const { auth } = require('../../lib/lucia'); // Will dynamically import
// const { Lucia } = require('lucia'); // Will dynamically import Argon2id
// const sql = require('../../lib/db').default; // Will dynamically import via getDbClient
const { v4: uuidv4 } = require('uuid');

// dotenv.config(); // Moved into configureServer

// Explicitly define Request and Response types for better IntelliSense and clarity
// This is not strictly necessary for the JavaScript runtime, but helps maintain consistency
/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

// Initialize Gemini and Argon2id
const QDRANT_COLLECTION_NAME = 'book_rag';
const geminiApiKey = process.env.GEMINI_API_KEY;

let generativeModel = null;

if (geminiApiKey) {
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  generativeModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
} else {
  console.warn('GEMINI_API_KEY environment variable is not set. Chat functionality will be limited.');
}

// Create a function to get the password hasher when needed
async function getPasswordHasher() { // Make function async
  if (typeof process === 'undefined' || !process.env) {
    return {
      async hash(password) {
        console.warn('Mock password hasher: returning plain text for build');
        return password;
      }
    };
  }

  try {
    // Dynamically import Lucia for Argon2id
    const { Argon2id } = await import('lucia');
    return new Argon2id();
  } catch (e) {
    console.warn('Failed to initialize Argon2id hasher:', e.message);
    return {
      async hash(password) {
        console.warn('Mock password hasher: returning plain text for build');
        return password;
      }
    };
  }
}

module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-api',

    // Make configureServer async
    async configureServer(app) {
      // Load environment variables here, where it's guaranteed to be Node.js context
      const dotenv = require('dotenv');
      dotenv.config();

      app.use(express.json());

      /**
       * Middleware to check if user is logged in.
       * Attaches user and session objects to req.
       * @param {Request} req
       * @param {Response} res
       * @param {NextFunction} next
       */
      const isAuthenticated = async (req, res, next) => {
        const sessionId = auth.readSessionCookie(req.headers.cookie ?? '');
        if (!sessionId) {
          req.user = null;
          req.session = null;
          return next();
        }
        const { session, user } = await auth.validateSession(sessionId);
        if (session) {
          req.user = user;
          req.session = session;
        } else {
          req.user = null;
          req.session = null;
        }
        next();
      };

      app.use(isAuthenticated);

      // Health Check Endpoint
      app.get('/api/health', (req, res) => {
        res.json({ status: 'ok' });
      });

      // User Endpoint (check if logged in)
      app.get('/api/user', (req, res) => {
        if (req.user) {
          return res.json({ user: { id: req.user.id, email: req.user.email } });
        } else {
          return res.json({ user: null });
        }
      });

      // Signup Endpoint
      app.post('/api/signup', async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password || password.length < 6) {
          return res.status(400).json({ error: 'Invalid email or password (min 6 characters).' });
        }

        try {
          const passwordHasher = getPasswordHasher();
          const hashedPassword = await passwordHasher.hash(password);
          const user = await auth.createUser({
            key: {
              providerId: 'email',
              providerUserId: email.toLowerCase(),
              password: hashedPassword,
            },
            attributes: {
              email: email.toLowerCase(),
            },
          });
          const session = await auth.createSession({
            userId: user.userId,
            attributes: {},
          });
          const sessionCookie = auth.createSessionCookie(session.id);
          res.setHeader('Set-Cookie', sessionCookie.serialize());
          return res.status(200).json({ message: 'User registered successfully', user: { id: user.userId, email: user.email } });
        } catch (error) {
          console.error('Error during signup:', error);
          // TODO: Handle specific Lucia errors (e.g., duplicate user)
          return res.status(500).json({ error: 'Failed to register user.' });
        }
      });

      // Login Endpoint
      app.post('/api/login', async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required.' });
        }

        try {
          const key = await auth.useKey('email', email.toLowerCase(), password);
          const session = await auth.createSession({
            userId: key.userId,
            attributes: {},
          });
          const sessionCookie = auth.createSessionCookie(session.id);
          res.setHeader('Set-Cookie', sessionCookie.serialize());
          return res.status(200).json({ message: 'Logged in successfully', user: { id: key.userId, email: email.toLowerCase() } });
        } catch (error) {
          console.error('Error during login:', error);
          return res.status(400).json({ error: 'Invalid credentials.' });
        }
      });

      // Logout Endpoint
      app.post('/api/logout', async (req, res) => {
        if (!req.session) {
          return res.status(401).json({ error: 'Not logged in.' });
        }
        try {
          await auth.invalidateSession(req.session.id);
          const sessionCookie = auth.createBlankSessionCookie();
          res.setHeader('Set-Cookie', sessionCookie.serialize());
          return res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
          console.error('Error during logout:', error);
          return res.status(500).json({ error: 'Failed to logout.' });
        }
      });

      // Get all chats for a logged-in user
      app.get('/api/chats', async (req, res) => {
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized: Please log in to view chats.' });
        }
        try {
          const chats = await sql`SELECT id, title, created_at FROM chats WHERE user_id = ${req.user.id} ORDER BY created_at DESC`;
          return res.json({ chats });
        } catch (error) {
          console.error('Error fetching chats:', error);
          return res.status(500).json({ error: 'Failed to fetch chats.' });
        }
      });

      // Get messages for a specific chat
      app.get('/api/chat/:chatId/messages', async (req, res) => {
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized: Please log in to view messages.' });
        }
        const { chatId } = req.params;
        try {
          const chat = await sql`SELECT user_id FROM chats WHERE id = ${chatId}`;
          if (chat.length === 0 || chat[0].user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden: You do not have access to this chat.' });
          }
          const messages = await sql`SELECT role, content, created_at FROM messages WHERE chat_id = ${chatId} ORDER BY created_at ASC`;
          return res.json({ messages });
        } catch (error) {
          console.error('Error fetching messages:', error);
          return res.status(500).json({ error: 'Failed to fetch messages.' });
        }
      });

      app.post('/api/chat', async (req, res) => {
        const { query, chatId } = req.body;
        if (!query) {
          return res.status(400).json({ error: 'Query is required in the request body.' });
        }
        console.log('Received chat query:', query);

        let currentChatId = chatId;
        let userId = null;

        if (req.user) {
            userId = req.user.id;
            if (!currentChatId) {
              currentChatId = uuidv4();
              await sql`
                INSERT INTO chats (id, user_id, title)
                VALUES (${currentChatId}, ${userId}, ${query.substring(0, 50)})
              `;
            }
        }

        try {
          // Fetch previous messages for context if chatId is provided
          let messageHistory = [];
          if (currentChatId) {
            const previousMessages = await sql`SELECT role, content FROM messages WHERE chat_id = ${currentChatId} ORDER BY created_at ASC`;
            messageHistory = previousMessages.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'model', // Gemini expects 'user' or 'model'
              parts: msg.content,
            }));
          }

          // Add the current user query to the message history
          messageHistory.push({ role: 'user', parts: query });

          const queryEmbedding = await generateEmbedding(query);

          const searchResult = await qdrantClient.search(QDRANT_COLLECTION_NAME, {
            vector: queryEmbedding,
            limit: 3,
            with_payload: true,
          });

          const relevantContent = searchResult.map(hit => hit.payload?.text).filter(Boolean);

          const ragPrompt = `Answer the following question based only on the provided context.
If the answer is not available in the context, state "I don't have enough information to answer that."

Context:
${relevantContent.join('\\n\\n')}

Question: ${query}`;

          // Replace the last user message with the RAG-enhanced prompt
          // This ensures the model receives the RAG context within the turn
          messageHistory[messageHistory.length - 1] = { role: 'user', parts: ragPrompt };

          const generatedText = await getChatResponse(messageHistory);

          if (userId && currentChatId) {
            await sql`
              INSERT INTO messages (id, chat_id, role, content)
              VALUES (${uuidv4()}, ${currentChatId}, 'user', ${query})
            `;
            await sql`
              INSERT INTO messages (id, chat_id, role, content)
              VALUES (${uuidv4()}, ${currentChatId}, 'assistant', ${generatedText})
            `;
          }

          res.json({
            query: query,
            relevant_content: relevantContent,
            response: generatedText,
            chatId: currentChatId,
          });

        } catch (error) {
          console.error('Error processing chat query:', error);
          res.status(500).json({ error: 'Failed to process chat query.' });
        }
      });
    },
  };
};