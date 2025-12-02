// src/lib/gemini.ts
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import * as dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables

const geminiApiKey = process.env.GEMINI_API_KEY;

let genAI: any;
let embeddingModel: any;
let chatModel: any; // Add chatModel here

// Initialize only when API key is available (not during static site build)
if (geminiApiKey) {
  genAI = new GoogleGenerativeAI(geminiApiKey);
  embeddingModel = genAI.getGenerativeModel({ model: 'embedding-001' }); // Use embedding-001 for embeddings
  chatModel = genAI.getGenerativeModel({ model: 'gemini-pro' }); // Initialize chatModel
} else {
  // For build time, we could either:
  // 1. Throw an error (current behavior)
  // 2. Provide a mock implementation
  // For now, we'll log a warning and provide a mock for build purposes
  console.warn('GEMINI_API_KEY environment variable is not set. Functionality may be limited during build.');
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!geminiApiKey || !embeddingModel) {
    // Return a mock embedding during build time or when API key is not set
    // This allows the build to proceed but functionality won't work without the key
    console.warn('GEMINI_API_KEY not set, returning mock embedding');
    return Array(768).fill(0); // Return a fixed-size array as a mock embedding (common embedding size)
  }

  try {
    const { embedding } = await embeddingModel.embedContent(text);
    return embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

export async function getChatResponse(
  messageHistory: { role: string; parts: string }[],
  generationConfig?: any,
  safetySettings?: any
): Promise<string> {
  if (!geminiApiKey || !chatModel) {
    console.warn('GEMINI_API_KEY not set, returning mock chat response.');
    return 'Gemini API key is not set. Please configure it to enable chat functionality.';
  }

  try {
    const chat = chatModel.startChat({
      history: messageHistory,
      generationConfig: generationConfig || {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
      safetySettings: safetySettings || [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Send the latest message (which is assumed to be the last item in messageHistory)
    const lastMessage = messageHistory[messageHistory.length - 1];
    const result = await chat.sendMessageStream(lastMessage.parts);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting chat response:', error);
    throw error;
  }
}
