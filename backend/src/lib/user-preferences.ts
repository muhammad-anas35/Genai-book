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

export interface UserBackground {
    softwareBackground?: string;
    hardwareBackground?: string;
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
    primaryInterest?: string;
    learningGoals?: string[];
}

export interface PersonalizedContent {
    preferredTopics?: string[];
    difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
    contentFormat?: 'text' | 'visual' | 'practical' | 'theoretical';
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
export async function createUserPreferences(userId: string, userBackground?: UserBackground) {
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
        userBackground: userBackground || null,
        personalizedContent: {
            preferredTopics: [],
            difficultyLevel: 'beginner',
            contentFormat: 'text',
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
        userBackground?: UserBackground;
        personalizedContent?: PersonalizedContent;
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
            userBackground: updates.userBackground !== undefined
                ? updates.userBackground
                : existing.userBackground,
            personalizedContent: updates.personalizedContent !== undefined
                ? { ...existing.personalizedContent as any, ...updates.personalizedContent }
                : existing.personalizedContent,
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

/**
 * Update user background information
 */
export async function updateUserBackground(userId: string, background: UserBackground) {
    return await updateUserPreferences(userId, { userBackground: background });
}

/**
 * Update personalized content preferences
 */
export async function updatePersonalizedContent(userId: string, content: PersonalizedContent) {
    return await updateUserPreferences(userId, { personalizedContent: content });
}
