import { Request, Response, NextFunction } from 'express';

/**
 * Validation middleware for authentication endpoints
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Password must be at least 8 characters and contain at least one number and one letter
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateSignupInput = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name, userBackground } = req.body;

  // Validate email
  if (!email || typeof email !== 'string' || !validateEmail(email)) {
    return res.status(400).json({
      error: 'Valid email is required',
      field: 'email'
    });
  }

  // Validate password
  if (!password || typeof password !== 'string' || !validatePassword(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters and contain at least one number and one letter',
      field: 'password'
    });
  }

  // Validate name if provided
  if (name && (typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 100)) {
    return res.status(400).json({
      error: 'Name must be between 1 and 100 characters if provided',
      field: 'name'
    });
  }

  // Validate userBackground if provided
  if (userBackground && typeof userBackground !== 'object') {
    return res.status(400).json({
      error: 'User background must be an object',
      field: 'userBackground'
    });
  }

  next();
};

export const validateLoginInput = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validate email
  if (!email || typeof email !== 'string' || !validateEmail(email)) {
    return res.status(400).json({
      error: 'Valid email is required',
      field: 'email'
    });
  }

  // Validate password
  if (!password || typeof password !== 'string' || password.length < 1) {
    return res.status(400).json({
      error: 'Password is required',
      field: 'password'
    });
  }

  next();
};

/**
 * Validation middleware for chat endpoints
 */
export const validateChatInput = (req: Request, res: Response, next: NextFunction) => {
  const { message, chapter, conversationId } = req.body;

  // Validate message
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      error: 'Message is required and must be a non-empty string',
      field: 'message'
    });
  }

  // Validate message length
  if (message.length > 2000) {
    return res.status(400).json({
      error: 'Message must be less than 2000 characters',
      field: 'message'
    });
  }

  // Validate chapter if provided
  if (chapter && (typeof chapter !== 'string' || chapter.length > 100)) {
    return res.status(400).json({
      error: 'Chapter must be less than 100 characters if provided',
      field: 'chapter'
    });
  }

  // Validate conversationId if provided
  if (conversationId && (typeof conversationId !== 'string' || conversationId.length > 100)) {
    return res.status(400).json({
      error: 'Conversation ID must be less than 100 characters if provided',
      field: 'conversationId'
    });
  }

  next();
};

/**
 * Validation middleware for preferences endpoints
 */
export const validatePreferencesInput = (req: Request, res: Response, next: NextFunction) => {
  const { theme, language, chatSettings, userBackground, personalizedContent } = req.body;

  // Validate theme
  if (theme && !['light', 'dark', 'auto'].includes(theme)) {
    return res.status(400).json({
      error: 'Theme must be one of: light, dark, auto',
      field: 'theme'
    });
  }

  // Validate language
  if (language && (typeof language !== 'string' || language.length !== 2)) {
    return res.status(400).json({
      error: 'Language must be a 2-character code (e.g., en, es)',
      field: 'language'
    });
  }

  // Validate chatSettings if provided
  if (chatSettings && typeof chatSettings !== 'object') {
    return res.status(400).json({
      error: 'Chat settings must be an object',
      field: 'chatSettings'
    });
  }

  // Validate userBackground if provided
  if (userBackground && typeof userBackground !== 'object') {
    return res.status(400).json({
      error: 'User background must be an object',
      field: 'userBackground'
    });
  }

  // Validate personalizedContent if provided
  if (personalizedContent && typeof personalizedContent !== 'object') {
    return res.status(400).json({
      error: 'Personalized content must be an object',
      field: 'personalizedContent'
    });
  }

  next();
};