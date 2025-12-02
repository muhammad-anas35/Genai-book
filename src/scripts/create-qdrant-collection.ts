// src/scripts/create-qdrant-collection.ts
import qdrantClient from '../lib/qdrant';

const collectionName = 'book_rag';

const createCollection = async () => {
  try {
    console.log(`Creating collection: ${collectionName}`);

    await qdrantClient.createCollection(collectionName, {
      vectors: {
        size: 1536, // A common size for text embedding models
        distance: 'Cosine',
      },
    });

    console.log('Collection created successfully.');
  } catch (error) {
    console.error('Error creating collection:', error);
  }
};

createCollection();
