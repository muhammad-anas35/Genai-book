import OpenAI from 'openai';
import { AIProvider } from './ai-provider';

/**
 * OpenAI Provider Implementation
 * Supports both regular chat completions and Assistant API
 */

export class OpenAIProvider implements AIProvider {
  private openai: OpenAI;
  private embeddingModel: string = 'text-embedding-3-small';
  private chatModel: string = 'gpt-4o';
  private assistantId?: string;

  constructor(apiKey: string, assistantId?: string, embeddingModel?: string, chatModel?: string) {
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required');
    }

    this.openai = new OpenAI({ apiKey });
    this.assistantId = assistantId;

    if (embeddingModel) {
      this.embeddingModel = embeddingModel;
    }

    if (chatModel) {
      this.chatModel = chatModel;
    }
  }

  /**
   * Generate response using OpenAI Chat Completions API
   */
  async generateResponse(prompt: string, context?: string): Promise<string> {
    try {
      const fullPrompt = context
        ? `Context:\n${context}\n\nQuestion: ${prompt}\n\nAnswer based on the context above:`
        : prompt;

      const response = await this.openai.chat.completions.create({
        model: this.chatModel,
        messages: [
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating OpenAI response:', error);
      throw error;
    }
  }

  /**
   * Generate response with streaming
   */
  async *generateResponseStream(prompt: string, context?: string): AsyncGenerator<string> {
    try {
      const fullPrompt = context
        ? `Context:\n${context}\n\nQuestion: ${prompt}\n\nAnswer based on the context above:`
        : prompt;

      const stream = await this.openai.chat.completions.create({
        model: this.chatModel,
        messages: [
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('Error generating OpenAI streaming response:', error);
      throw error;
    }
  }

  /**
   * Generate embedding for a single text
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: this.embeddingModel,
        input: text,
        encoding_format: 'float',
      });

      return response.data[0]?.embedding || [];
    } catch (error) {
      console.error('Error generating OpenAI embedding:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      // OpenAI has a limit of 2048 texts per request
      const batchSize = 2000; // Leave some margin
      const embeddings: number[][] = [];

      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const response = await this.openai.embeddings.create({
          model: this.embeddingModel,
          input: batch,
          encoding_format: 'float',
        });

        for (const item of response.data) {
          embeddings.push(item.embedding);
        }

        // Small delay to avoid rate limiting
        if (i + batchSize < texts.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      return embeddings;
    } catch (error) {
      console.error('Error generating OpenAI embeddings:', error);
      throw error;
    }
  }

  /**
   * Get provider name
   */
  getName(): string {
    return 'openai';
  }

  /**
   * Get embedding dimension based on model
   */
  getEmbeddingDimension(): number {
    // text-embedding-3-small has 1536 dimensions by default
    // text-embedding-3-large has 3072 dimensions
    if (this.embeddingModel.includes('large')) {
      return 3072;
    }
    return 1536;
  }

  /**
   * Create an assistant thread
   */
  async createThread(): Promise<string> {
    const thread = await this.openai.beta.threads.create();
    return thread.id;
  }

  /**
   * Add a message to a thread
   */
  async addMessageToThread(threadId: string, content: string): Promise<void> {
    await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: content,
    });
  }

  /**
   * Run an assistant on a thread
   */
  async runAssistant(threadId: string, assistantId?: string): Promise<string> {
    const assistantIdToUse = assistantId || this.assistantId;

    if (!assistantIdToUse) {
      throw new Error('No assistant ID provided');
    }

    const run = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantIdToUse,
    });

    // Wait for the run to complete
    let runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
    while (runStatus.status !== 'completed' && runStatus.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    if (runStatus.status === 'failed') {
      throw new Error(`Assistant run failed: ${runStatus.last_error?.message}`);
    }

    // Get the messages
    const messages = await this.openai.beta.threads.messages.list(threadId, {
      run_id: run.id,
    });

    // Get the latest assistant message
    const latestMessage = messages.data
      .filter(msg => msg.role === 'assistant')
      .sort((a, b) => b.created_at - a.created_at)[0];

    if (!latestMessage) {
      throw new Error('No assistant response found');
    }

    // Extract text content
    const textContent = latestMessage.content
      .filter(item => item.type === 'text')
      .map(item => (item as any).text.value)
      .join('\n\n');

    return textContent;
  }
}