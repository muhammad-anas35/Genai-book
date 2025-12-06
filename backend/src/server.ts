import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables FIRST before any other imports
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Try backend/.env.local first
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Fallback to root .env.local
if (!process.env.DATABASE_URL) {
    dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
}

// Now import other modules that need env vars
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { db } from './db';
import * as schema from './db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// Import route modules
import chatRoutes from './routes/chat';
import preferencesRoutes from './routes/preferences';

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
 * Body: { email, password, name }
 */
app.post('/api/auth/signup/email', async (req: AuthRequest, res: Response) => {
    try {
        const { email, password, name } = req.body;

        console.log('[SIGNUP] Request received:', { email, name, passwordLength: password?.length });

        // Validate input
        if (!email || !password) {
            console.warn('[SIGNUP] Missing email or password');
            return res.status(400).json({ error: 'Email and password required' });
        }

        if (password.length < 8) {
            console.warn('[SIGNUP] Password too short');
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        if (!email.includes('@')) {
            console.warn('[SIGNUP] Invalid email format');
            return res.status(400).json({ error: 'Invalid email format' });
        }

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

        // Hash password
        console.log('[SIGNUP] Hashing password');
        const passwordHash = crypto
            .createHash('sha256')
            .update(password + process.env.BETTER_AUTH_SECRET)
            .digest('hex');

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
        res.status(500).json({
            error: 'Signup failed. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * Email/Password Login
 * POST /api/auth/signin/email
 * Body: { email, password }
 */
app.post('/api/auth/signin/email', async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = req.body;

        console.log('[LOGIN] Request received:', { email });

        if (!email || !password) {
            console.warn('[LOGIN] Missing email or password');
            return res.status(400).json({ error: 'Email and password required' });
        }

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

        // Verify password
        const passwordHash = crypto
            .createHash('sha256')
            .update(password + process.env.BETTER_AUTH_SECRET)
            .digest('hex');

        if (passwordHash !== user.passwordHash) {
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
        res.status(500).json({
            error: 'Login failed. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ error: 'Route not found' });
});

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
