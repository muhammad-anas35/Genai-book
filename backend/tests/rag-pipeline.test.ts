import { describe, it, expect, beforeEach, vi } from 'vitest';
import { executeRAG, RAGResult, RAGOptions } from '../src/lib/rag-pipeline';
import { generateQueryEmbedding } from '../src/lib/embeddings';
import { searchSimilarChunks } from '../src/lib/vector-store';
import { getGeminiClient } from '../src/lib/gemini-client';

vi.mock('../src/lib/embeddings');
vi.mock('../src/lib/vector-store');
vi.mock('../src/lib/gemini-client');

describe('RAG Pipeline', () => {
  const mockQuery = 'What is ROS 2?';
  const mockEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5];
  const mockSearchResults = [
    {
      id: 'chunk-1',
      content: 'ROS 2 is a flexible framework for writing robot software.',
      documentPath: 'chapters/ros2-intro.md',
      score: 0.85,
      chapter: 'Introduction to ROS 2',
      section: 'Overview'
    },
    {
      id: 'chunk-2',
      content: 'ROS 2 provides libraries and tools to help software developers create robot applications.',
      documentPath: 'chapters/ros2-architecture.md',
      score: 0.78,
      chapter: 'ROS 2 Architecture',
      section: 'Components'
    }
  ];
  const mockGeminiResponse = 'ROS 2 is a flexible framework for writing robot software...';

  beforeEach(() => {
    vi.clearAllMocks();
    (generateQueryEmbedding as vi.MockedFunction<any>).mockResolvedValue(mockEmbedding);
    (searchSimilarChunks as vi.MockedFunction<any>).mockResolvedValue(mockSearchResults);
    (getGeminiClient as vi.MockedFunction<any>).mockReturnValue({
      generateResponse: vi.fn().mockResolvedValue(mockGeminiResponse)
    });
  });

  it('should execute RAG pipeline successfully with default options', async () => {
    const result: RAGResult = await executeRAG(mockQuery);

    expect(result).toHaveProperty('answer');
    expect(result).toHaveProperty('sources');
    expect(result).toHaveProperty('metadata');
    expect(result.answer).toBe(mockGeminiResponse);
    expect(result.sources).toHaveLength(2);
    expect(result.metadata.chunksRetrieved).toBe(2);
  });

  it('should filter results by minimum score', async () => {
    const options: RAGOptions = { minScore: 0.8 };
    const result: RAGResult = await executeRAG(mockQuery, options);

    expect(result.sources).toHaveLength(1); // Only first result has score > 0.8
    expect(result.sources[0].score).toBe(0.85);
  });

  it('should limit results by topK option', async () => {
    const options: RAGOptions = { topK: 1 };
    const result: RAGResult = await executeRAG(mockQuery, options);

    expect(result.sources).toHaveLength(1);
  });

  it('should handle empty search results gracefully', async () => {
    (searchSimilarChunks as vi.MockedFunction<any>).mockResolvedValue([]);

    const result: RAGResult = await executeRAG(mockQuery);

    expect(result.answer).toContain("couldn't find relevant information");
    expect(result.sources).toHaveLength(0);
  });

  it('should filter results after minimum score check', async () => {
    const mockResultsWithLowScores = [
      {
        id: 'chunk-1',
        content: 'Some content',
        documentPath: 'chapters/test.md',
        score: 0.5, // Below default minScore of 0.7
        chapter: 'Test Chapter',
        section: 'Test Section'
      }
    ];

    (searchSimilarChunks as vi.MockedFunction<any>).mockResolvedValue(mockResultsWithLowScores);

    const result: RAGResult = await executeRAG(mockQuery);

    expect(result.sources).toHaveLength(0);
    expect(result.answer).toContain("couldn't find relevant information");
  });

  it('should handle errors gracefully', async () => {
    (generateQueryEmbedding as vi.MockedFunction<any>).mockRejectedValue(new Error('Embedding failed'));

    await expect(executeRAG(mockQuery)).rejects.toThrow('Failed to generate response. Please try again.');
  });

  it('should pass chapter filter to search function', async () => {
    const options: RAGOptions = { chapter: 'Introduction to ROS 2' };
    await executeRAG(mockQuery, options);

    expect(searchSimilarChunks).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Number),
      'Introduction to ROS 2'
    );
  });
});