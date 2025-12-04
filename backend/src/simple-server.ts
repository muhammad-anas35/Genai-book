import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Simple chat endpoint (mock response for testing)
app.post('/api/chat', (req, res) => {
    const { message } = req.body;

    res.json({
        success: true,
        message: {
            role: 'assistant',
            content: `You asked: "${message}". The backend is working! However, the RAG pipeline needs the full server with database and Qdrant to provide real answers. This is a test response to verify connectivity.`,
            sources: [
                {
                    chunkId: 'test-1',
                    documentPath: 'test/doc.md',
                    content: 'Test source content',
                    score: 0.95,
                    chapter: 'Test Chapter'
                }
            ]
        },
        metadata: {
            retrievalTime: 100,
            generationTime: 500,
            totalTime: 600,
            chunksRetrieved: 1
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║   🚀 Simple Backend Server Running       ║
╚═══════════════════════════════════════════╝

Server: http://localhost:${PORT}
Health: http://localhost:${PORT}/api/health

This is a simplified server for testing.
Chat will work but responses are mocked.
  `);
});
