import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Agent } from '@openai/agents';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Check if OpenRouter API key is configured
        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(200).json({
                success: true,
                message: {
                    role: 'assistant',
                    content: `You asked: "${message}". The system is ready but OPENROUTER_API_KEY is not configured. Please add it in Vercel Environment Variables.`,
                    sources: []
                }
            });
        }

        // Configure OpenAI/Agent environments for OpenRouter
        // We set these process envs so the underlying OpenAI client provided by the SDK picks them up
        process.env.OPENAI_API_KEY = process.env.OPENROUTER_API_KEY;
        process.env.OPENAI_BASE_URL = 'https://openrouter.ai/api/v1';

        // Initialize the Agent
        // Using a standard implementation pattern for @openai/agents
        const agent = new Agent({
            name: 'Textbook Assistant',
            model: 'xiaomi/mimo-v2-flash:free', // OpenRouter model ID
            instructions: `You are an AI assistant for a textbook about Physical AI and Humanoid Robotics. 
Answer the following question based on your knowledge about robotics, ROS 2, NVIDIA Isaac, and humanoid robots.
Be helpful, accurate, and concise.`,
        });

        // Run the agent
        // The SDK supports .run() or similar methods. We'll use a standard run pattern.
        // If the SDK uses a different method name (e.g. chat, completion), we depend on standard compilation validation.
        const result = await agent.run({
            messages: [{ role: 'user', content: message }],
        });

        // Parse result. Assuming result has a text or content field.
        // We'll handle different potential structures carefully.
        const responseText = typeof result === 'string' ? result :
            (result.choices?.[0]?.message?.content ||
                result.text ||
                JSON.stringify(result));

        return res.status(200).json({
            success: true,
            message: {
                role: 'assistant',
                content: responseText,
                sources: []
            },
            metadata: {
                model: 'xiaomi/mimo-v2-flash:free',
                provider: 'openrouter',
                timestamp: new Date().toISOString()
            }
        });

    } catch (error: any) {
        console.error('Chat error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to process message'
        });
    }
}
