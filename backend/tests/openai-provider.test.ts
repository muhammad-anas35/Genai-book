import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OpenAIProvider } from '../src/lib/openai-provider';

// Mock the OpenAI library
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: 'This is a test response from OpenAI'
                }
              }
            ]
          })
        }
      },
      embeddings: {
        create: vi.fn().mockResolvedValue({
          data: [
            {
              embedding: [0.1, 0.2, 0.3, 0.4, 0.5]
            }
          ]
        })
      },
      beta: {
        threads: {
          create: vi.fn().mockResolvedValue({ id: 'thread_123' }),
          messages: {
            create: vi.fn().mockResolvedValue({}),
          },
          runs: {
            create: vi.fn().mockResolvedValue({ id: 'run_123' }),
            retrieve: vi.fn().mockResolvedValue({ status: 'completed' }),
          },
        }
      }
    }))
  };
});

describe('OpenAI Provider', () => {
  let provider: OpenAIProvider;

  beforeEach(() => {
    provider = new OpenAIProvider('test-api-key');
  });

  it('should initialize with correct configuration', () => {
    expect(provider.getName()).toBe('openai');
    expect(provider.getEmbeddingDimension()).toBe(1536); // Default for text-embedding-3-small
  });

  it('should generate a response', async () => {
    const response = await provider.generateResponse('Hello, how are you?');
    expect(response).toBe('This is a test response from OpenAI');
  });

  it('should generate an embedding', async () => {
    const embedding = await provider.generateEmbedding('Test text for embedding');
    expect(embedding).toEqual([0.1, 0.2, 0.3, 0.4, 0.5]);
  });

  it('should generate multiple embeddings', async () => {
    const texts = ['Text 1', 'Text 2'];
    const embeddings = await provider.generateEmbeddings(texts);

    expect(embeddings).toHaveLength(2);
    expect(embeddings[0]).toEqual([0.1, 0.2, 0.3, 0.4, 0.5]);
    expect(embeddings[1]).toEqual([0.1, 0.2, 0.3, 0.4, 0.5]);
  });

  it('should handle different embedding dimensions', () => {
    const largeProvider = new OpenAIProvider('test-api-key', undefined, 'text-embedding-3-large');
    expect(largeProvider.getEmbeddingDimension()).toBe(3072);
  });
});