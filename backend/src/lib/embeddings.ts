import { ProviderFactory } from './provider-factory';
import { AIProviderType } from './ai-provider';
import { TextChunk } from './chunking';
import { v4 as uuidv4 } from 'uuid';

/**
 * Embedding generation utilities
 */

export interface EmbeddingResult {
    chunkId: string;
    embedding: number[];
    metadata: {
        documentPath: string;
        chunkIndex: number;
        content: string;
        wordCount: number;
        chapter?: string;
        section?: string;
    };
}

/**
 * Generate embeddings for text chunks
 */
export async function generateEmbeddings(
    chunks: TextChunk[],
    documentPath: string,
    chapter?: string,
    section?: string,
    provider: AIProviderType = 'gemini'
): Promise<EmbeddingResult[]> {
    const aiProvider = ProviderFactory.getProvider(provider);
    const results: EmbeddingResult[] = [];

    // Extract text from chunks
    const texts = chunks.map(chunk => chunk.content);

    // Generate embeddings in batch
    console.log(`Generating embeddings for ${chunks.length} chunks using ${provider}...`);
    const embeddings = await aiProvider.generateEmbeddings(texts);

    // Combine with metadata
    for (let i = 0; i < chunks.length; i++) {
        results.push({
            chunkId: uuidv4(),
            embedding: embeddings[i],
            metadata: {
                documentPath,
                chunkIndex: chunks[i].index,
                content: chunks[i].content,
                wordCount: chunks[i].wordCount,
                chapter,
                section
            }
        });
    }

    return results;
}

/**
 * Generate embedding for a single query
 */
export async function generateQueryEmbedding(query: string, provider: AIProviderType = 'gemini'): Promise<number[]> {
    const aiProvider = ProviderFactory.getProvider(provider);
    return await aiProvider.generateEmbedding(query);
}
