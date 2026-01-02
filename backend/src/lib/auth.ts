import { betterAuth } from "better-auth";

export const auth = betterAuth({
    database: {
        // Database configuration
        provider: "pg", // PostgreSQL
        url: process.env.DATABASE_URL!,
    },
    emailAndPassword: {
        enabled: true,
        // requireEmailVerification: true, // Disabled
    },
});
