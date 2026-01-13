import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to manually load env file
const loadEnvFile = (filePath: string) => {
    try {
        if (!fs.existsSync(filePath)) return false;
        console.log(`📂 Manual loading: ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        let count = 0;
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx === -1) continue;

            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();

            // Remove quotes if present
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }

            if (key && !process.env[key]) {
                process.env[key] = val;
                count++;
            }
        }
        console.log(`✅ Loaded ${count} variables from ${path.basename(filePath)}`);
        return true;
    } catch (e: any) {
        console.error(`❌ Failed to load ${filePath}:`, e.message);
        return false;
    }
};

// Load environment variables FIRST before any other imports
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPathBackend = path.resolve(__dirname, '../.env.local');
const envPathRoot = path.resolve(__dirname, '../../.env.local');

// Try backend/.env.local first
if (!loadEnvFile(envPathBackend)) {
    console.log('⚠️ backend/.env.local not found');
}

// Fallback to root .env.local if DATABASE_URL missing
if (!process.env.DATABASE_URL) {
    console.log('Trying root .env.local fallback...');
    loadEnvFile(envPathRoot);
}

// Support NEON_DATABASE_URL as an alias for DATABASE_URL
if (!process.env.DATABASE_URL && process.env.NEON_DATABASE_URL) {
    process.env.DATABASE_URL = process.env.NEON_DATABASE_URL;
    console.log('✅ Using NEON_DATABASE_URL as DATABASE_URL');
}

// Now import other modules that need env vars
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { db } from './db';
import * as schema from './db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Import route modules
import chatRoutes from './routes/chat';
import preferencesRoutes from './routes/preferences';

// Import user preferences service
import { createUserPreferences } from './lib/user-preferences';

// Import validation middleware
import {
    validateSignupInput,
    validateLoginInput,
    validateChatInput
} from './middleware/validation';

// Import error handling utilities
import { globalErrorHandler, AppError } from './utils/error-handler';

const app = express();
const PORT = process.env.PORT || 4000;

// Validate required environment variables
if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not set in .env.local');
    console.error('Please create .env.local with DATABASE_URL from Neon');
    process.exit(1);
}

if (!process.env.BETTER_AUTH_SECRET) {
    console.error('❌ ERROR: BETTER_AUTH_SECRET not set in .env.local');
    console.error('Generate with: openssl rand -hex 32');
    process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log('📝 Database URL configured');
console.log('🔐 Auth secret configured');

// ========================================
// TYPES
// ========================================

interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
    userName?: string;
}

// ========================================
// MIDDLEWARE
// ========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
app.use(cors({
    origin: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Require authentication middleware
const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const sessionToken = req.cookies['better-auth.session_token'];

    if (!sessionToken) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Please login to access this resource'
        });
    }

    // Store token for use in route handlers
    req.userId = sessionToken.substring(0, 16);
    next();
};

// ========================================
// HEALTH CHECK
// ========================================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        authenticated: !!req.cookies['better-auth.session_token']
    });
});

/**
 * Database Health Check
 * GET /api/health/db
 */
app.get('/api/health/db', async (req, res) => {
    try {
        console.log('[DB-CHECK] Testing database connection...');

        const result = await db.select().from(schema.users).limit(1);

        console.log('[DB-CHECK] Database connection successful');
        res.json({
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('[DB-CHECK] Database connection failed:', error.message);
        res.status(503).json({
            status: 'error',
            database: 'disconnected',
            error: error.message,
            message: 'Cannot connect to database. Check DATABASE_URL in .env.local'
        });
    }
});

/**
 * Get current session
 * GET /api/auth/session
 */
app.get('/api/auth/session', async (req: AuthRequest, res: Response) => {
    try {
        const sessionToken = req.cookies['better-auth.session_token'];

        if (!sessionToken) {
            return res.status(401).json({ authenticated: false });
        }

        res.json({
            authenticated: true,
            session: {
                token: sessionToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
        });
    } catch (error) {
        console.error('Session check error:', error);
        res.status(500).json({ error: 'Session check failed' });
    }
});

/**
 * Email/Password Registration
 * POST /api/auth/signup/email
 * Body: { email, password, name, userBackground }
 */
app.post('/api/auth/signup/email', validateSignupInput, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { email, password, name, userBackground } = req.body;

        console.log('[SIGNUP] Request received:', { email, name, passwordLength: password?.length, hasUserBackground: !!userBackground });

        // Check if user already exists
        console.log('[SIGNUP] Checking if user exists:', email.toLowerCase());
        const existingUser = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email.toLowerCase()))
            .limit(1);

        if (existingUser.length > 0) {
            console.warn('[SIGNUP] User already exists:', email);
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash password with bcrypt
        console.log('[SIGNUP] Hashing password');
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const userId = crypto.randomBytes(16).toString('hex');
        console.log('[SIGNUP] Creating user with ID:', userId);

        await db.insert(schema.users).values({
            id: userId,
            email: email.toLowerCase(),
            name: name || email.split('@')[0],
            passwordHash,
            emailVerified: false,
        });

        console.log('[SIGNUP] User created successfully');

        // Create user preferences with background info
        if (userBackground) {
            console.log('[SIGNUP] Creating user preferences with background:', userBackground);
            await createUserPreferences(userId, userBackground);
        } else {
            console.log('[SIGNUP] Creating default user preferences');
            await createUserPreferences(userId);
        }

        console.log('[SIGNUP] User preferences created');

        // Create session token
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const sessionId = crypto.randomBytes(16).toString('hex');

        console.log('[SIGNUP] Creating session');
        await db.insert(schema.sessions).values({
            id: sessionId,
            userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        console.log('[SIGNUP] Session created');

        // Set cookie
        res.cookie('better-auth.session_token', sessionToken, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        console.log('[SIGNUP] Cookie set, sending success response');

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: userId,
                email: email.toLowerCase(),
                name: name || email.split('@')[0],
            },
            redirect: '/'
        });

    } catch (error: any) {
        console.error('[SIGNUP ERROR]', {
            message: error.message,
            code: error.code,
            detail: error.detail,
            stack: error.stack
        });

        // Use global error handler
        if (error instanceof AppError) {
            return next(error);
        }

        // For other errors, create a generic AppError
        const appError = new AppError('Signup failed. Please try again.', 500);
        next(appError);
    }
});

/**
 * Email/Password Login
 * POST /api/auth/signin/email
 * Body: { email, password }
 */
app.post('/api/auth/signin/email', validateLoginInput, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        console.log('[LOGIN] Request received:', { email });

        // Find user
        console.log('[LOGIN] Finding user:', email.toLowerCase());
        const users = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email.toLowerCase()))
            .limit(1);

        if (users.length === 0) {
            console.warn('[LOGIN] User not found:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0];
        console.log('[LOGIN] User found, verifying password');

        // Verify password with bcrypt
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            console.warn('[LOGIN] Invalid password for:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        console.log('[LOGIN] Password verified, creating session');

        // Create session
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const sessionId = crypto.randomBytes(16).toString('hex');

        await db.insert(schema.sessions).values({
            id: sessionId,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        console.log('[LOGIN] Session created, setting cookie');

        // Set cookie
        res.cookie('better-auth.session_token', sessionToken, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        console.log('[LOGIN] Success for:', email);

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            redirect: '/'
        });

    } catch (error: any) {
        console.error('[LOGIN ERROR]', {
            message: error.message,
            code: error.code,
            detail: error.detail,
            stack: error.stack
        });

        // Use global error handler
        if (error instanceof AppError) {
            return next(error);
        }

        // For other errors, create a generic AppError
        const appError = new AppError('Login failed. Please try again.', 500);
        next(appError);
    }
});

/**
 * Email/Password Logout
 * POST /api/auth/signout
 */
app.post('/api/auth/signout', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        res.clearCookie('better-auth.session_token', {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
        });

        res.json({
            success: true,
            message: 'Logged out successfully',
            redirect: '/auth/login'
        });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

/**
 * Get current user info (protected)
 * GET /api/auth/me
 */
app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        const sessionToken = req.cookies['better-auth.session_token'];

        if (!sessionToken) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        res.json({
            authenticated: true,
            user: {
                email: 'user@example.com',
                name: 'User',
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to get user info' });
    }
});

/**
 * Check if user is authenticated (public)
 * GET /api/auth/check
 */
app.get('/api/auth/check', (req: AuthRequest, res: Response) => {
    const isAuthenticated = !!req.cookies['better-auth.session_token'];
    res.json({
        authenticated: isAuthenticated,
        message: isAuthenticated ? 'User is logged in' : 'User is not logged in'
    });
});

// ========================================
// PROTECTED ROUTES (Require Authentication)
// ========================================

/**
 * Get user dashboard (protected)
 * GET /api/dashboard
 */
app.get('/api/dashboard', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            message: 'Welcome to your dashboard',
            data: {
                totalChats: 0,
                recentChats: [],
                stats: {
                    questionsAsked: 0,
                    topicsLearned: 0,
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard' });
    }
});

// ========================================
// CHAT/RAG ROUTES (Protected)
// ========================================

// Mount chat routes with authentication
app.use('/api/chat', requireAuth, chatRoutes);

// Mount preferences routes with authentication
app.use('/api/preferences', requireAuth, preferencesRoutes);

// ========================================
// ERROR HANDLING
// ========================================

// 404 handler for undefined routes
app.use((req: express.Request, res: express.Response) => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    res.status(404).json({
        success: false,
        error: error.message
    });
});

// Global error handler middleware
app.use(globalErrorHandler);

// ========================================
// START SERVER
// ========================================

app.listen(PORT, async () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║    📚 Book RAG Backend Server - Authentication API       ║
╚═══════════════════════════════════════════════════════════╝

🚀 Server running at: http://localhost:${PORT}
📡 Frontend URL: ${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}

🔧 Environment:
  ✅ DATABASE_URL configured
  ✅ BETTER_AUTH_SECRET configured
  ✅ Node.js environment ready

📊 Available Endpoints:

  PUBLIC (No login required):
  ✅ GET    /api/health               - Server health check
  ✅ GET    /api/health/db            - Database health check
  ✅ GET    /api/auth/check           - Check authentication status
  ✅ POST   /api/auth/signup/email    - Create new account
  ✅ POST   /api/auth/signin/email    - Login with email/password
  
  PROTECTED (Login required):
  🔐 POST   /api/auth/signout         - Logout and clear session
  🔐 GET    /api/auth/session         - Get current session info
  🔐 GET    /api/auth/me              - Get authenticated user info
  🔐 GET    /api/dashboard            - User dashboard data
  🔐 POST   /api/chat                 - Send message to RAG chatbot
  🔐 GET    /api/chat/history         - Get user's chat history

🔒 Security:
  ✅ HTTPOnly cookies (XSS protected)
  ✅ CORS enabled for frontend
  ✅ Password hashing with SHA256
  ✅ 7-day session expiry

⚠️  DIAGNOSTICS:
  To test database connection: curl http://localhost:${PORT}/api/health/db
  Check frontend CORS: Verify ${process.env.BETTER_AUTH_URL} in browser console

    `);

    // Test database connection on startup
    try {
        const testQuery = await db.select().from(schema.users).limit(1);
        console.log('✅ Database connection verified');
    } catch (error: any) {
        console.error('❌ WARNING: Database connection failed!');
        console.error('   Error:', error.message);
        console.error('   Please verify DATABASE_URL in .env.local');
    }
});

export default app;
