import { db } from '../db';
import { userPreferences } from '../db/schema/preferences';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

/**
 * User preferences service
 * Handles storage and retrieval of user preferences
 */

export interface ChatSettings {
    temperature?: number;
    maxTokens?: number;
    showSources?: boolean;
    autoSave?: boolean;
}

/**
 * Get user preferences
 */
export async function getUserPreferences(userId: string) {
    const prefs = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId))
        .limit(1);

    if (prefs.length === 0) {
        // Create default preferences
        return await createUserPreferences(userId);
    }

    return prefs[0];
}

/**
 * Create default user preferences
 */
export async function createUserPreferences(userId: string) {
    const [pref] = await db.insert(userPreferences).values({
        id: uuidv4(),
        userId,
        theme: 'light',
        language: 'en',
        chatSettings: {
            temperature: 0.7,
            maxTokens: 1000,
            showSources: true,
            autoSave: true,
        },
    }).returning();

    return pref;
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
    userId: string,
    updates: {
        theme?: string;
        language?: string;
        chatSettings?: ChatSettings;
    }
) {
    const existing = await getUserPreferences(userId);

    const [updated] = await db
        .update(userPreferences)
        .set({
            theme: updates.theme || existing.theme,
            language: updates.language || existing.language,
            chatSettings: updates.chatSettings
                ? { ...existing.chatSettings as any, ...updates.chatSettings }
                : existing.chatSettings,
            updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, userId))
        .returning();

    return updated;
}

/**
 * Update chat settings only
 */
export async function updateChatSettings(userId: string, settings: ChatSettings) {
    return await updateUserPreferences(userId, { chatSettings: settings });
}
