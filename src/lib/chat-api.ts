/**
 * Chat API client for frontend
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

const API_BASE_URL = 'http://localhost:4000';

/**
 * Send a chat message and get AI response
 */
export async function sendMessage(
    message: string,
    chapter?: string
): Promise<ChatResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify({ message, chapter }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to send message');
        }

        return await response.json();
    } catch (error) {
        console.error('Chat API error:', error);
        throw error;
    }
}

/**
 * Stream chat response (for real-time updates)
 */
export async function* streamMessage(
    message: string,
    chapter?: string
): AsyncGenerator<{ type: string; data: any }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ message, chapter }),
        });

        if (!response.ok) {
            throw new Error('Failed to stream message');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error('No response body');
        }

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.slice(6));
                    yield data;
                }
            }
        }
    } catch (error) {
        console.error('Stream error:', error);
        throw error;
    }
}

/**
 * Get chat history
 */
export async function getChatHistory(): Promise<any[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/history`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch history');
        }

        const data = await response.json();
        return data.history || [];
    } catch (error) {
        console.error('History API error:', error);
        return [];
    }
}
