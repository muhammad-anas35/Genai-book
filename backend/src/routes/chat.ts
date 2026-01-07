import { Router, Request, Response } from 'express';
import { executeRAG, executeRAGStream } from '../lib/rag-pipeline';
import { saveMessage, getOrCreateConversation, getUserConversations, getConversationMessages } from '../lib/chat-history';
import { validateChatInput } from '../middleware/validation';
import { ProviderFactory } from '../lib/provider-factory';

/**
 * Chat routes for RAG-powered Q&A
 */

const router = Router();

/**
 * POST /api/chat
 * Send a message and get AI response with RAG
 */
router.post('/', validateChatInput, async (req: any, res: Response) => {
    try {
        const { message, chapter, conversationId, provider } = req.body;
        const userId = req.userId; // From auth middleware

        // Get or create conversation
        const convId = conversationId || await getOrCreateConversation(userId);

        // Save user message
        await saveMessage(convId, 'user', message);

        // Execute RAG pipeline
        const result = await executeRAG(message, {
            topK: 5,
            minScore: 0.7,
            chapter: chapter || undefined,
            provider: provider || 'gemini'
        });

        // Save assistant response
        await saveMessage(convId, 'assistant', result.answer, result.sources);

        // Return response
        res.json({
            success: true,
            conversationId: convId,
            message: {
                role: 'assistant',
                content: result.answer,
                sources: result.sources
            },
            metadata: result.metadata
        });

    } catch (error: any) {
        console.error('Chat error:', error);

        // Use global error handler
        if (error instanceof AppError) {
            return next(error);
        }

        // For other errors, create a generic AppError
        const appError = new AppError('Failed to generate response. Please try again.', 500);
        next(appError);
    }
});

/**
 * POST /api/chat/stream
 * Stream AI response with RAG (for real-time UI)
 */
router.post('/stream', validateChatInput, async (req: any, res: Response) => {
    try {
        const { message, chapter, provider } = req.body;

        // Set headers for SSE (Server-Sent Events)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Execute RAG pipeline with streaming
        for await (const chunk of executeRAGStream(message, {
            topK: 5,
            minScore: 0.7,
            chapter: chapter || undefined,
            provider: provider || 'gemini'
        })) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }

        res.end();

    } catch (error: any) {
        console.error('Chat stream error:', error);
        res.write(`data: ${JSON.stringify({ type: 'error', data: 'Failed to generate response' })}\n\n`);
        res.end();
    }
});

/**
 * GET /api/chat/history
 * Get user's conversation history
 */
router.get('/history', async (req: any, res: Response) => {
    try {
        const userId = req.userId;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = parseInt(req.query.offset as string) || 0;

        const conversations = await getUserConversations(userId, limit, offset);

        res.json({
            success: true,
            conversations,
            total: conversations.length,
            limit,
            offset
        });

    } catch (error: any) {
        console.error('History error:', error);

        // Use global error handler
        if (error instanceof AppError) {
            return next(error);
        }

        // For other errors, create a generic AppError
        const appError = new AppError('Failed to fetch history', 500);
        next(appError);
    }
});

/**
 * GET /api/chat/conversation/:id
 * Get messages for a specific conversation
 */
router.get('/conversation/:id', async (req: any, res: Response) => {
    try {
        const conversationId = req.params.id;
        const messages = await getConversationMessages(conversationId);

        res.json({
            success: true,
            conversationId,
            messages
        });

    } catch (error: any) {
        console.error('Conversation error:', error);

        // Use global error handler
        if (error instanceof AppError) {
            return next(error);
        }

        // For other errors, create a generic AppError
        const appError = new AppError('Failed to fetch conversation', 500);
        next(appError);
    }
});

// Get available AI providers
router.get('/providers', (req: any, res: Response) => {
    try {
        const availableProviders = ProviderFactory.getAvailableProviders();
        res.json({
            success: true,
            providers: availableProviders
        });
    } catch (error) {
        console.error('Get providers error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch available providers'
        });
    }
});

export default router;
