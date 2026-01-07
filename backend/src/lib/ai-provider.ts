/**
 * AI Provider Interface
 * Abstracts different AI services (Gemini, OpenAI, etc.)
 */

export interface AIProvider {
  /**
   * Generate a response based on a prompt and context
   */
  generateResponse(prompt: string, context?: string): Promise<string>;

  /**
   * Generate a response with streaming
   */
  generateResponseStream(prompt: string, context?: string): AsyncGenerator<string>;

  /**
   * Generate embedding for a single text
   */
  generateEmbedding(text: string): Promise<number[]>;

  /**
   * Generate embeddings for multiple texts
   */
  generateEmbeddings(texts: string[]): Promise<number[][]>;

  /**
   * Get the name of the provider
   */
  getName(): string;

  /**
   * Get the embedding dimension
   */
  getEmbeddingDimension(): number;
}

export type AIProviderType = 'gemini' | 'openai';

export interface AIProviderConfig {
  gemini?: {
    apiKey: string;
    embeddingModel?: string;
    chatModel?: string;
  };
  openai?: {
    apiKey: string;
    assistantId?: string;
    embeddingModel?: string;
    chatModel?: string;
  };
}