import { GoogleGenAI } from '@google/genai';

/**
 * Gemini API client for embeddings and chat
 * Updated to use the new @google/genai SDK
 */

export class GeminiClient {
    private genAI: GoogleGenAI;
    private embeddingModel: string = 'text-embedding-004';
    private chatModel: string = 'gemini-2.0-flash';

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is required');
        }

        this.genAI = new GoogleGenAI({ apiKey });
    }

    /**
     * Generate embedding for a single text
     */
    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const response = await this.genAI.models.embedContent({
                model: this.embeddingModel,
                contents: text,
            });
            return response.embeddings?.[0]?.values || [];
        } catch (error) {
            console.error('Error generating embedding:', error);
            throw error;
        }
    }

    /**
     * Generate embeddings for multiple texts in batch
     */
    async generateEmbeddings(texts: string[]): Promise<number[][]> {
        const embeddings: number[][] = [];

        // Process in batches of 5 to avoid rate limits
        const batchSize = 5;
        for (let i = 0; i < texts.length; i += batchSize) {
            const batch = texts.slice(i, i + batchSize);
            const batchEmbeddings = await Promise.all(
                batch.map(text => this.generateEmbedding(text))
            );
            embeddings.push(...batchEmbeddings);

            // Small delay to avoid rate limiting
            if (i + batchSize < texts.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        return embeddings;
    }

    /**
     * Generate chat response with context
     */
    async generateResponse(prompt: string, context?: string): Promise<string> {
        try {
            const fullPrompt = context
                ? `Context:\n${context}\n\nQuestion: ${prompt}\n\nAnswer based on the context above:`
                : prompt;

            const response = await this.genAI.models.generateContent({
                model: this.chatModel,
                contents: fullPrompt,
                config: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                    topP: 0.9,
                    topK: 40,
                }
            });

            return response.text || '';
        } catch (error) {
            console.error('Error generating response:', error);
            throw error;
        }
    }

    /**
     * Generate chat response with streaming
     */
    async *generateResponseStream(prompt: string, context?: string): AsyncGenerator<string> {
        try {
            const fullPrompt = context
                ? `Context:\n${context}\n\nQuestion: ${prompt}\n\nAnswer based on the context above:`
                : prompt;

            const response = await this.genAI.models.generateContentStream({
                model: this.chatModel,
                contents: fullPrompt,
                config: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                    topP: 0.9,
                    topK: 40,
                }
            });

            for await (const chunk of response) {
                if (chunk.text) {
                    yield chunk.text;
                }
            }
        } catch (error) {
            console.error('Error generating streaming response:', error);
            throw error;
        }
    }
}

// Singleton instance
let geminiClient: GeminiClient | null = null;

/**
 * Get or create Gemini client instance
 */
export function getGeminiClient(): GeminiClient {
    if (!geminiClient) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
        }
        geminiClient = new GeminiClient(apiKey);
    }
    return geminiClient;
}

