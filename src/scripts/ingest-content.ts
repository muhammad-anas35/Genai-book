// src/scripts/ingest-content.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';
import * as dotenv from 'dotenv';
import { generateEmbedding } from '../lib/gemini';
import qdrantClient from '../lib/qdrant'; // Import Qdrant client

dotenv.config(); // Load environment variables from .env file

const docsPath = path.join(process.cwd(), 'docs');
const QDRANT_COLLECTION_NAME = 'book_rag'; // Qdrant collection name

function chunkMarkdownContent(content: string): string[] {
  const chunks: string[] = [];
  const headingRegex = /(^#\s.*$|^##\s.*$)/gm;
  const parts = content.split(headingRegex);

  let currentChunk = '';
  for (const part of parts) {
    if (headingRegex.test(part)) {
      if (currentChunk.trim() !== '') {
        chunks.push(currentChunk.trim());
      }
      currentChunk = part + '\n';
    } else {
      currentChunk += part;
    }
  }
  if (currentChunk.trim() !== '') {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(chunk => chunk.length > 0);
}

async function readDocusaurusContent() {
  const markdownFiles = await glob('**/*.md', { cwd: docsPath });

  let pointIdCounter = 0; // Simple counter for unique point IDs

  for (const file of markdownFiles) {
    const filePath = path.join(docsPath, file);
    const content = await fs.readFile(filePath, 'utf-8');
    
    const chunks = chunkMarkdownContent(content);
    console.log(`--- Chunks from: ${file} (${chunks.length} chunks) ---`);
    
    const points = [];
    for (const chunk of chunks) {
      if (chunk.length === 0) continue;

      pointIdCounter++;
      console.log(`Chunk:\n${chunk.substring(0, 200)}...\n`);
      
      try {
        const embedding = await generateEmbedding(chunk);
        // console.log(`Embedding (first 5 dimensions): [${embedding.slice(0, 5).join(', ')}...]\n`);

        points.push({
          id: pointIdCounter, // Assign unique ID
          vector: embedding,
          payload: {
            text: chunk,
            source: file, // Store the relative file path as source
          },
        });
      } catch (error) {
        console.error('Failed to generate embedding for chunk:', error);
      }
    }

    if (points.length > 0) {
      try {
        await qdrantClient.upsert(QDRANT_COLLECTION_NAME, {
          wait: true,
          points: points,
        });
        console.log(`Successfully upserted ${points.length} points for ${file} to Qdrant.`);
      } catch (qdrantError) {
        console.error(`Error upserting points for ${file} to Qdrant:`, qdrantError);
      }
    }
    console.log(`--- End of processing: ${file} ---`);
  }
}

readDocusaurusContent().catch(console.error);
