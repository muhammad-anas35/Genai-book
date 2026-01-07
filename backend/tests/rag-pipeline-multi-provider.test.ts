import { describe, it, expect, beforeEach, vi } from 'vitest';
import { executeRAG, RAGOptions } from '../src/lib/rag-pipeline';
import { ProviderFactory } from '../src/lib/provider-factory';

// Mock the provider factory
vi.mock('../src/lib/provider-factory', () => {
  const mockProvider = {
    generateEmbedding: vi.fn().mockResolvedValue([0.1, 0.2, 0.3]),
    generateResponse: vi.fn().mockResolvedValue('Mock response'),
    generateResponseStream: vi.fn().mockImplementation(function*() {
      yield 'Mock stream response';
    }),
    getName: vi.fn().mockReturnValue('mock-provider'),
    getEmbeddingDimension: vi.fn().mockReturnValue(768)
  };

  return {
    ProviderFactory: {
      getProvider: vi.fn().mockReturnValue(mockProvider),
      getAvailableProviders: vi.fn().mockReturnValue(['gemini', 'openai'])
    }
  };
});

// Mock the vector store
vi.mock('../src/lib/vector-store', () => {
  return {
    searchSimilarChunks: vi.fn().mockResolvedValue([
      {
        id: 'chunk-1',
        content: 'Test content for RAG',
        documentPath: 'test/doc.md',
        score: 0.85,
        chapter: 'Test Chapter',
        section: 'Test Section'
      }
    ])
  };
});

describe('RAG Pipeline with Multiple Providers', () => {
  const mockQuery = 'What is the meaning of life?';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should execute with default provider (gemini)', async () => {
    const result = await executeRAG(mockQuery);

    expect(result).toHaveProperty('answer');
    expect(result).toHaveProperty('sources');
    expect(result).toHaveProperty('metadata');
    expect(result.metadata.provider).toBe('mock-provider');
  });

  it('should execute with specified gemini provider', async () => {
    const options: RAGOptions = { provider: 'gemini' };
    const result = await executeRAG(mockQuery, options);

    expect(result.metadata.provider).toBe('mock-provider');
  });

  it('should execute with specified openai provider', async () => {
    const options: RAGOptions = { provider: 'openai' };
    const result = await executeRAG(mockQuery, options);

    expect(result.metadata.provider).toBe('mock-provider');
  });

  it('should use default parameters when not specified', async () => {
    const result = await executeRAG(mockQuery);

    expect(ProviderFactory.getProvider).toHaveBeenCalledWith('gemini');
  });

  it('should handle empty search results gracefully', async () => {
    // Mock empty search results
    const { searchSimilarChunks } = await import('../src/lib/vector-store');
    vi.mocked(searchSimilarChunks).mockResolvedValue([]);

    const result = await executeRAG(mockQuery);

    expect(result.answer).toContain("couldn't find relevant information");
    expect(result.sources).toHaveLength(0);
  });

  it('should pass correct options to provider', async () => {
    const options: RAGOptions = {
      topK: 3,
      minScore: 0.5,
      chapter: 'Introduction',
      provider: 'gemini'
    };

    await executeRAG(mockQuery, options);

    // Verify the provider was called with correct parameters
    const mockProvider: any = ProviderFactory.getProvider('gemini');
    expect(mockProvider.generateEmbedding).toHaveBeenCalledWith(mockQuery);
    expect(mockProvider.generateResponse).toHaveBeenCalled();
  });
});