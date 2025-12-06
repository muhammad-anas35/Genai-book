import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * Chat and conversation schema for RAG history
 */

// Conversations table - groups of chat messages
export const conversations = pgTable('conversations', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    title: text('title').default('New Conversation'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Chat messages table - individual messages within conversations
export const chatMessages = pgTable('chat_messages', {
    id: text('id').primaryKey(),
    conversationId: text('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }).notNull(),
    role: text('role').notNull(), // 'user' or 'assistant'
    content: text('content').notNull(),
    sources: jsonb('sources'), // Array of source citations for AI responses
    createdAt: timestamp('created_at').defaultNow(),
});

// Legacy chat history table (for backward compatibility)
export const chatHistory = pgTable('chat_history', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    message: text('message').notNull(),
    response: text('response').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// Types for insert operations
export type NewConversation = typeof conversations.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;

