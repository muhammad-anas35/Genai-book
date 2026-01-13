/**
 * Chat API client for frontend - Mock implementation
 */

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    sources?: Array<{
        chunkId: string;
        documentPath: string;
        content: string;
        score: number;
        chapter?: string;
        section?: string;
    }>;
}

export interface ChatResponse {
    success: boolean;
    message: ChatMessage;
    metadata?: {
        retrievalTime: number;
        generationTime: number;
        totalTime: number;
        chunksRetrieved: number;
    };
    error?: string;
}

/**
 * Simulate sending a chat message and getting a mock AI response
 */
export async function sendMessage(
    message: string,
    chapter?: string,
    provider?: 'gemini' | 'openai'
): Promise<ChatResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Mock response based on the user's message
    const mockResponse: ChatResponse = {
        success: true,
        message: {
            role: 'assistant',
            content: `I received your message: "${message}". This is a simulated response since the backend has been removed. In a real implementation, an AI would process your query and provide a relevant answer based on the available documentation.`,
            sources: []
        },
        metadata: {
            retrievalTime: 100 + Math.random() * 200,
            generationTime: 300 + Math.random() * 400,
            totalTime: 500 + Math.random() * 600,
            chunksRetrieved: 3
        }
    };

    return mockResponse;
}

/**
 * Mock stream chat response (for real-time updates)
 */
export async function* streamMessage(
    message: string,
    chapter?: string,
    provider?: 'gemini' | 'openai'
): AsyncGenerator<{ type: string; data: any }> {
    // Simulate streaming response
    const parts = [
        { type: 'chunk', data: { content: 'Processing your request...' } },
        { type: 'chunk', data: { content: 'Analyzing query...' } },
        { type: 'chunk', data: { content: 'Generating response...' } },
        { type: 'complete', data: { content: `Simulated response for: "${message}"` } }
    ];

    for (const part of parts) {
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
        yield part;
    }
}

/**
 * Mock get chat history
 */
export async function getChatHistory(): Promise<any[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Return empty history or sample history
    return [];
}

/**
 * Mock get available AI providers
 */
export async function getAvailableProviders(): Promise<{ success: boolean; providers: string[] }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
        success: true,
        providers: ['mock-ai'] // Return mock provider since backend is removed
    };
}
