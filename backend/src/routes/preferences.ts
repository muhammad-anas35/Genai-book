import { Router, Request, Response } from 'express';
import { getUserPreferences, updateUserPreferences } from '../lib/user-preferences';
import { validatePreferencesInput } from '../middleware/validation';
import { AppError } from '../utils/error-handler';

/**
 * User preferences routes
 */

const router = Router();

/**
 * GET /api/preferences
 * Get user preferences
 */
router.get('/', async (req: any, res: Response, next: any) => {
    try {
        const userId = req.userId;
        const preferences = await getUserPreferences(userId);

        res.json({
            success: true,
            preferences
        });

    } catch (error: any) {
        console.error('Get preferences error:', error);

        // Use global error handler
        if (error instanceof AppError) {
            return next(error);
        }

        // For other errors, create a generic AppError
        const appError = new AppError('Failed to fetch preferences', 500);
        next(appError);
    }
});

/**
 * PUT /api/preferences
 * Update user preferences
 */
router.put('/', validatePreferencesInput, async (req: any, res: Response, next: any) => {
    try {
        const userId = req.userId;
        const { theme, language, chatSettings, userBackground, personalizedContent } = req.body;

        const updated = await updateUserPreferences(userId, {
            theme,
            language,
            chatSettings,
            userBackground,
            personalizedContent
        });

        res.json({
            success: true,
            preferences: updated
        });

    } catch (error: any) {
        console.error('Update preferences error:', error);

        // Use global error handler
        if (error instanceof AppError) {
            return next(error);
        }

        // For other errors, create a generic AppError
        const appError = new AppError('Failed to update preferences', 500);
        next(appError);
    }
});

export default router;
