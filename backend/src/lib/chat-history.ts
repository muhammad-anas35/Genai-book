import { db } from '../db';
import { conversations, chatMessages } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

import { v4 as uuidv4 } from 'uuid';

/**
 * Chat history service
 * Handles storage and retrieval of conversations and messages
 */

/**
 * Create a new conversation
 */
export async function createConversation(userId: string, title?: string): Promise<string> {
    const id = uuidv4();
    await db.insert(conversations).values({
        id,
        userId,
        title: title || 'New Conversation',
    });

    return id;
}

/**
 * Save a message to a conversation
 */
export async function saveMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    sources?: any[]
): Promise<void> {
    await db.insert(chatMessages).values({
        id: uuidv4(),
        conversationId,
        role,
        content,
        sources: sources ? JSON.stringify(sources) : null,
    });

    // Update conversation's updatedAt timestamp
    await db.update(conversations)
        .set({ updatedAt: new Date() })
        .where(eq(conversations.id, conversationId));
}

/**
 * Get user's conversations
 */
export async function getUserConversations(
    userId: string,
    limit: number = 20,
    offset: number = 0
) {
    const userConversations = await db
        .select()
        .from(conversations)
        .where(eq(conversations.userId, userId))
        .orderBy(desc(conversations.updatedAt))
        .limit(limit)
        .offset(offset);

    // Get message count for each conversation
    const conversationsWithCount = await Promise.all(
        userConversations.map(async (conv) => {
            const messages = await db
                .select()
                .from(chatMessages)
                .where(eq(chatMessages.conversationId, conv.id));

            return {
                ...conv,
                messageCount: messages.length,
            };
        })
    );

    return conversationsWithCount;
}

/**
 * Get messages for a conversation
 */
export async function getConversationMessages(conversationId: string) {
    return await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.conversationId, conversationId))
        .orderBy(chatMessages.createdAt);
}

/**
 * Get or create conversation for user
 * If user has no conversations, create one
 */
export async function getOrCreateConversation(userId: string): Promise<string> {
    const userConvs = await db
        .select()
        .from(conversations)
        .where(eq(conversations.userId, userId))
        .orderBy(desc(conversations.updatedAt))
        .limit(1);

    if (userConvs.length > 0) {
        return userConvs[0].id;
    }

    return await createConversation(userId);
}

/**
 * Delete a conversation and all its messages
 */
export async function deleteConversation(conversationId: string, userId: string): Promise<boolean> {
    // Verify ownership
    const conv = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, conversationId))
        .limit(1);

    if (conv.length === 0 || conv[0].userId !== userId) {
        return false;
    }

    await db.delete(conversations).where(eq(conversations.id, conversationId));
    return true;
}
