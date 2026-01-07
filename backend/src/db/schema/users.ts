import { pgTable, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';

/**
 * User authentication schema
 */

// Users table for authentication
export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name'),
    passwordHash: text('password_hash'),
    emailVerified: boolean('email_verified').default(false),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Sessions table for authentication
export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Accounts table for OAuth providers
export const accounts = pgTable('accounts', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    accountId: varchar('account_id', { length: 255 }).notNull(),
    providerId: varchar('provider_id', { length: 255 }).notNull(), // google, github, etc.
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Refresh tokens for JWT authentication
export const refreshTokens = pgTable('refresh_tokens', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    issuedAt: timestamp('issued_at').defaultNow(),
    revoked: boolean('revoked').default(false),
});

// Types for insert operations
export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Account = typeof accounts.$inferSelect;

