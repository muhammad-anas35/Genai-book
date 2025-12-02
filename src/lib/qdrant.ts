// src/lib/qdrant.ts
import { QdrantClient } from '@qdrant/qdrant-js';
import * as dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables

// The URL of your Qdrant instance.
// You can get this from your Qdrant Cloud dashboard.
const qdrantUrl = process.env.QDRANT_URL;

// The API key for your Qdrant instance.
// You can generate this in your Qdrant Cloud dashboard.
const qdrantApiKey = process.env.QDRANT_API_KEY;

let qdrantClient: any;

if (qdrantUrl) {
  qdrantClient = new QdrantClient({
    url: qdrantUrl,
    apiKey: qdrantApiKey,
  });
} else {
  console.warn('QDRANT_URL environment variable is not set. Qdrant functionality will be limited.');
  // Create a mock client for build time
  qdrantClient = {
    search: async () => [],
    upsert: async () => {},
    createCollection: async () => {},
  };
}

export default qdrantClient;
