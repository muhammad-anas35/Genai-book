import { pgTable, text, timestamp, jsonb, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * User preferences schema
 */

// User preferences table
export const userPreferences = pgTable('user_preferences', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
    theme: varchar('theme', { length: 20 }).default('light'), // 'light', 'dark', 'auto'
    language: varchar('language', { length: 10 }).default('en'),
    chatSettings: jsonb('chat_settings').default({}), // Custom chat settings
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Types for insert operations
export type NewUserPreferences = typeof userPreferences.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;

/**
 * Default chat settings structure:
 * {
 *   temperature: 0.7,
 *   maxTokens: 1000,
 *   showSources: true,
 *   autoSave: true
 * }
 */

