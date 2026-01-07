import { AIProvider, AIProviderType, AIProviderConfig } from './ai-provider';
import { GeminiClient } from './gemini-client';
import { OpenAIProvider } from './openai-provider';

/**
 * AI Provider Factory
 * Creates and manages AI providers based on configuration
 */

export class ProviderFactory {
  private static geminiProvider: AIProvider | null = null;
  private static openaiProvider: AIProvider | null = null;

  /**
   * Get or create provider based on type
   */
  static getProvider(providerType: AIProviderType): AIProvider {
    switch (providerType) {
      case 'gemini':
        if (!this.geminiProvider) {
          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
          }

          this.geminiProvider = new GeminiClient(apiKey);
        }
        return this.geminiProvider;

      case 'openai':
        if (!this.openaiProvider) {
          const apiKey = process.env.OPENAI_API_KEY;
          if (!apiKey) {
            throw new Error('OPENAI_API_KEY environment variable is not set');
          }

          const assistantId = process.env.OPENAI_ASSISTANT_ID;
          const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL;
          const chatModel = process.env.OPENAI_CHAT_MODEL;

          this.openaiProvider = new OpenAIProvider(
            apiKey,
            assistantId,
            embeddingModel,
            chatModel
          );
        }
        return this.openaiProvider;

      default:
        throw new Error(`Unsupported provider type: ${providerType}`);
    }
  }

  /**
   * Get the default provider (based on environment configuration)
   */
  static getDefaultProvider(): AIProvider {
    const defaultProvider = process.env.DEFAULT_AI_PROVIDER || 'gemini';
    return this.getProvider(defaultProvider as AIProviderType);
  }

  /**
   * Check if a provider is configured
   */
  static isProviderConfigured(providerType: AIProviderType): boolean {
    switch (providerType) {
      case 'gemini':
        return !!process.env.GEMINI_API_KEY;
      case 'openai':
        return !!process.env.OPENAI_API_KEY;
      default:
        return false;
    }
  }

  /**
   * Get list of available providers
   */
  static getAvailableProviders(): AIProviderType[] {
    const available: AIProviderType[] = [];

    if (this.isProviderConfigured('gemini')) {
      available.push('gemini');
    }

    if (this.isProviderConfigured('openai')) {
      available.push('openai');
    }

    return available;
  }

  /**
   * Clear cached providers (useful for testing)
   */
  static clearCache(): void {
    this.geminiProvider = null;
    this.openaiProvider = null;
  }
}