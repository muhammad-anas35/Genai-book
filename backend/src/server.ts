import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { db } from '../../../src/db';
import * as schema from '../../../src/db/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 4000;

// ========================================
// TYPES
// ========================================

interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
    userName?: string;
}

// ========================================
// MIDDLEWARE
// ========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
app.use(cors({
    origin: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Require authentication middleware
const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const sessionToken = req.cookies['better-auth.session_token'];
    
    if (!sessionToken) {
        return res.status(401).json({ 
            error: 'Unauthorized',
            message: 'Please login to access this resource'
        });
    }
    
    // Store token for use in route handlers
    req.userId = sessionToken.substring(0, 16);
    next();
};

// ========================================
// HEALTH CHECK
// ========================================

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        authenticated: !!req.cookies['better-auth.session_token']
    });
});

/**
 * Get current session
 * GET /api/auth/session
 */
app.get('/api/auth/session', async (req: AuthRequest, res: Response) => {
    try {
        const sessionToken = req.cookies['better-auth.session_token'];
        
        if (!sessionToken) {
            return res.status(401).json({ authenticated: false });
        }

        res.json({ 
            authenticated: true,
            session: {
                token: sessionToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
        });
    } catch (error) {
        console.error('Session check error:', error);
        res.status(500).json({ error: 'Session check failed' });
    }
});

/**
 * Email/Password Registration
 * POST /api/auth/signup/email
 * Body: { email, password, name }
 */
app.post('/api/auth/signup/email', async (req: AuthRequest, res: Response) => {
    try {
        const { email, password, name } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        if (!email.includes('@')) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if user already exists
        const existingUser = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email.toLowerCase()))
            .limit(1);

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash password
        const passwordHash = crypto
            .createHash('sha256')
            .update(password + process.env.BETTER_AUTH_SECRET)
            .digest('hex');

        // Create user
        const userId = crypto.randomBytes(16).toString('hex');
        
        await db.insert(schema.users).values({
            id: userId,
            email: email.toLowerCase(),
            name: name || email.split('@')[0],
            passwordHash,
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Create session token
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const sessionId = crypto.randomBytes(16).toString('hex');
        
        await db.insert(schema.sessions).values({
            id: sessionId,
            userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
        });

        // Set cookie
        res.cookie('better-auth.session_token', sessionToken, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({ 
            success: true,
            message: 'Account created successfully',
            user: {
                id: userId,
                email: email.toLowerCase(),
                name: name || email.split('@')[0],
            },
            redirect: '/'
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Signup failed. Please try again.' });
    }
});

/**
 * Email/Password Login
 * POST /api/auth/signin/email
 * Body: { email, password }
 */
app.post('/api/auth/signin/email', async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Find user
        const users = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email.toLowerCase()))
            .limit(1);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0];

        // Verify password
        const passwordHash = crypto
            .createHash('sha256')
            .update(password + process.env.BETTER_AUTH_SECRET)
            .digest('hex');

        if (passwordHash !== user.passwordHash) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create session token
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const sessionId = crypto.randomBytes(16).toString('hex');
        
        await db.insert(schema.sessions).values({
            id: sessionId,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
        });

        // Set cookie
        res.cookie('better-auth.session_token', sessionToken, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ 
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            redirect: '/'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

/**
 * Logout
 * POST /api/auth/signout
 */
app.post('/api/auth/signout', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        res.clearCookie('better-auth.session_token', {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
        });

        res.json({ 
            success: true, 
            message: 'Logged out successfully',
            redirect: '/login'
        });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

/**
 * Get current user info (protected)
 * GET /api/auth/me
 */
app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        const sessionToken = req.cookies['better-auth.session_token'];
        
        if (!sessionToken) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        res.json({
            authenticated: true,
            user: {
                email: 'user@example.com',
                name: 'User',
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to get user info' });
    }
});

/**
 * Check if user is authenticated (public)
 * GET /api/auth/check
 */
app.get('/api/auth/check', (req: AuthRequest, res: Response) => {
    const isAuthenticated = !!req.cookies['better-auth.session_token'];
    res.json({ 
        authenticated: isAuthenticated,
        message: isAuthenticated ? 'User is logged in' : 'User is not logged in'
    });
});

// ========================================
// PROTECTED ROUTES (Require Authentication)
// ========================================

/**
 * Get user dashboard (protected)
 * GET /api/dashboard
 */
app.get('/api/dashboard', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            message: 'Welcome to your dashboard',
            data: {
                totalChats: 0,
                recentChats: [],
                stats: {
                    questionsAsked: 0,
                    topicsLearned: 0,
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard' });
    }
});

// ========================================
// CHAT/RAG ROUTES (Protected)
// ========================================

/**
 * Send message to RAG system (protected)
 * POST /api/chat
 * Body: { message }
 */
app.post('/api/chat', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message required' });
        }

        // TODO: Implement RAG pipeline
        // 1. Embed user message
        // 2. Search Qdrant for relevant chunks
        // 3. Generate response with Gemini
        // 4. Store in chat_history table

        res.json({ 
            success: true,
            response: 'RAG pipeline not yet implemented. This is a placeholder response.',
            sources: [],
            messageId: crypto.randomBytes(16).toString('hex'),
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Chat failed' });
    }
});

/**
 * Get chat history (protected)
 * GET /api/chat/history
 */
app.get('/api/chat/history', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        res.json({ 
            success: true,
            history: []
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// ========================================
// ERROR HANDLING
// ========================================

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║    📚 Book RAG Backend Server         ║
║         (Authentication API)          ║
╚═══════════════════════════════════════╝

🚀 Server running at: http://localhost:${PORT}
📡 Frontend expects: ${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}
🗄️  Database: ${process.env.DATABASE_URL ? '✅ Connected' : '❌ Missing'}

Available Endpoints:
  PUBLIC:
  ✅ GET    /api/health               - Health check
  ✅ GET    /api/auth/check           - Check auth status
  ✅ POST   /api/auth/signup/email    - Create account
  ✅ POST   /api/auth/signin/email    - Login
  
  PROTECTED (require login):
  🔐 POST   /api/auth/signout         - Logout
  🔐 GET    /api/auth/session         - Get session info
  🔐 GET    /api/auth/me              - Get user info
  🔐 GET    /api/dashboard            - User dashboard
  🔐 POST   /api/chat                 - Send message
  🔐 GET    /api/chat/history         - Get chat history

🔐 Protected endpoints require valid session cookie

    `);
});

export default app;
