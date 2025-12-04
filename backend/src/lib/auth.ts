import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';

/**
 * Better Auth instance
 * Configured with Drizzle ORM adapter and email/password authentication
 */

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg', // PostgreSQL (Neon)
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to true when email service is configured
    },

    // Optional: Add social providers when ready
    // socialProviders: {
    //   google: {
    //     clientId: process.env.GOOGLE_CLIENT_ID as string,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    //   },
    //   github: {
    //     clientId: process.env.GITHUB_CLIENT_ID as string,
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    //   },
    // },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // 5 minutes
        },
    },

    advanced: {
        cookiePrefix: 'better-auth',
        crossSubDomainCookies: {
            enabled: false,
        },
    },
});
