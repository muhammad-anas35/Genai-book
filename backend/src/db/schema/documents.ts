import { pgTable, text, timestamp, integer, varchar } from 'drizzle-orm/pg-core';

/**
 * Document schema for content ingestion tracking
 */

// Documents table - metadata about ingested content files
export const documents = pgTable('documents', {
    id: text('id').primaryKey(),
    path: text('path').notNull().unique(), // File path relative to docs/
    title: varchar('title', { length: 255 }).notNull(),
    chapter: varchar('chapter', { length: 100 }),
    section: varchar('section', { length: 100 }),
    wordCount: integer('word_count').default(0),
    chunkCount: integer('chunk_count').default(0),
    ingestedAt: timestamp('ingested_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Document chunks table - individual chunks with vector references
export const documentChunks = pgTable('document_chunks', {
    id: text('id').primaryKey(),
    documentId: text('document_id').references(() => documents.id, { onDelete: 'cascade' }).notNull(),
    chunkIndex: integer('chunk_index').notNull(),
    content: text('content').notNull(),
    wordCount: integer('word_count').default(0),
    vectorId: varchar('vector_id', { length: 255 }).unique(), // Qdrant vector ID
    createdAt: timestamp('created_at').defaultNow(),
});

// Types for insert operations
export type NewDocument = typeof documents.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type NewDocumentChunk = typeof documentChunks.$inferInsert;
export type DocumentChunk = typeof documentChunks.$inferSelect;

