import { getQdrantClient, VectorPoint } from './qdrant-client';
import { EmbeddingResult } from './embeddings';
import { ProviderFactory } from './provider-factory';
import { AIProviderType } from './ai-provider';

/**
 * Vector storage utilities for Qdrant
 */

/**
 * Store embeddings in Qdrant
 */
export async function storeEmbeddings(embeddings: EmbeddingResult[], provider: AIProviderType = 'gemini'): Promise<void> {
    const qdrant = getQdrantClient();
    const aiProvider = ProviderFactory.getProvider(provider);

    // Ensure collection exists with the correct dimension for the provider
    const dimension = aiProvider.getEmbeddingDimension();
    await qdrant.ensureCollection(dimension);

    // Convert to Qdrant points
    const points: VectorPoint[] = embeddings.map(emb => ({
        id: emb.chunkId,
        vector: emb.embedding,
        payload: {
            documentPath: emb.metadata.documentPath,
            chunkIndex: emb.metadata.chunkIndex,
            content: emb.metadata.content,
            wordCount: emb.metadata.wordCount,
            chapter: emb.metadata.chapter || null,
            section: emb.metadata.section || null
        }
    }));

    // Upsert in batches of 100
    const batchSize = 100;
    for (let i = 0; i < points.length; i += batchSize) {
        const batch = points.slice(i, i + batchSize);
        await qdrant.upsertVectors(batch);
        console.log(`✓ Stored batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(points.length / batchSize)}`);
    }

    console.log(`✓ Stored ${points.length} embeddings in Qdrant using ${provider} (dimension: ${dimension})`);
}

/**
 * Search for similar chunks
 */
export async function searchSimilarChunks(
    queryEmbedding: number[],
    limit: number = 5,
    chapter?: string
): Promise<Array<{
    id: string;
    score: number;
    content: string;
    documentPath: string;
    chunkIndex: number;
    chapter?: string;
    section?: string;
}>> {
    const qdrant = getQdrantClient();

    // Build filter if chapter specified
    const filter = chapter ? {
        must: [
            {
                key: 'chapter',
                match: { value: chapter }
            }
        ]
    } : undefined;

    // Search
    const results = await qdrant.search(queryEmbedding, limit, filter);

    // Format results
    return results.map(r => ({
        id: r.id,
        score: r.score,
        content: r.payload.content as string,
        documentPath: r.payload.documentPath as string,
        chunkIndex: r.payload.chunkIndex as number,
        chapter: r.payload.chapter as string | undefined,
        section: r.payload.section as string | undefined
    }));
}

/**
 * Get vector count in collection
 */
export async function getVectorCount(): Promise<number> {
    const qdrant = getQdrantClient();
    return await qdrant.countVectors();
}

/**
 * Delete all vectors (for re-ingestion)
 */
export async function clearVectors(): Promise<void> {
    const qdrant = getQdrantClient();
    await qdrant.deleteCollection();
    console.log('✓ Cleared all vectors');
}
