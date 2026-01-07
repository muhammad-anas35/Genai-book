import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ProviderFactory } from '../src/lib/provider-factory';

// Mock environment variables
const originalEnv = process.env;

describe('Provider Factory', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    ProviderFactory.clearCache(); // Clear any cached providers
  });

  afterEach(() => {
    process.env = originalEnv;
    ProviderFactory.clearCache(); // Clean up after each test
  });

  it('should create Gemini provider when configured', () => {
    process.env.GEMINI_API_KEY = 'test-gemini-key';

    const provider = ProviderFactory.getProvider('gemini');

    expect(provider).toBeDefined();
    expect(provider.getName()).toBe('gemini');
  });

  it('should create OpenAI provider when configured', () => {
    process.env.OPENAI_API_KEY = 'test-openai-key';

    const provider = ProviderFactory.getProvider('openai');

    expect(provider).toBeDefined();
    expect(provider.getName()).toBe('openai');
  });

  it('should return default provider', () => {
    process.env.GEMINI_API_KEY = 'test-gemini-key';
    process.env.DEFAULT_AI_PROVIDER = 'gemini';

    const provider = ProviderFactory.getDefaultProvider();

    expect(provider.getName()).toBe('gemini');
  });

  it('should check if provider is configured', () => {
    process.env.GEMINI_API_KEY = 'test-key';
    expect(ProviderFactory.isProviderConfigured('gemini')).toBe(true);

    delete process.env.GEMINI_API_KEY;
    expect(ProviderFactory.isProviderConfigured('gemini')).toBe(false);
  });

  it('should get available providers', () => {
    process.env.GEMINI_API_KEY = 'test-gemini-key';
    process.env.OPENAI_API_KEY = 'test-openai-key';

    const available = ProviderFactory.getAvailableProviders();

    expect(available).toContain('gemini');
    expect(available).toContain('openai');
    expect(available).toHaveLength(2);
  });

  it('should cache providers', () => {
    process.env.GEMINI_API_KEY = 'test-gemini-key';

    const provider1 = ProviderFactory.getProvider('gemini');
    const provider2 = ProviderFactory.getProvider('gemini');

    expect(provider1).toBe(provider2); // Same instance
  });
});