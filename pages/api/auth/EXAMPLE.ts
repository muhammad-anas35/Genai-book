import { auth } from '@/lib/auth';
import type { NextRequest } from 'next/server';

/**
 * This is an example API route handler for better-auth
 * Save this file as: pages/api/auth/[...auth].ts
 * 
 * For Docusaurus + Node.js backend, use the Node.js version below
 */

// ========================================
// NEXT.JS VERSION (if migrating to Next.js)
// ========================================
export async function POST(req: NextRequest) {
    return auth.toNextJsHandler()(req as any);
}

export async function GET(req: NextRequest) {
    return auth.toNextJsHandler()(req as any);
}

/**
 * FOR CURRENT DOCUSAURUS SETUP:
 * 
 * You need to create a separate Node.js/Express backend service
 * or use Vercel Edge Functions. Here's a suggested approach:
 * 
 * 1. Create a backend folder at project root:
 *    mkdir -p api/auth
 * 
 * 2. Create api/auth/route.ts with Express handler
 * 
 * 3. Run backend separately during development:
 *    node api/server.js
 * 
 * 4. Update environment:
 *    BETTER_AUTH_URL=http://localhost:4000
 * 
 * See ../../../backend/examples/auth-handler.ts for Node.js example
 */
