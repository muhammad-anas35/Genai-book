// src/lib/lucia.ts
import { Lucia } from 'lucia';
import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql';
import sql from './db'; // Import the configured postgres-js instance

const adapter = new PostgresJsAdapter(sql, {
  user: 'users',
  session: 'sessions', // This table name is typically 'session' by convention, but needs to match Lucia's configuration.
});

export const auth = new Lucia(adapter, {
  sessionCookie: {
    expires: false, // Session cookies last until the browser is closed
    attributes: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    },
  },
  getUserAttributes: (attributes: { email: string }) => {
    return {
      email: attributes.email,
    };
  },
});

declare module 'lucia' {
  interface RegisterCustomLucia {
    Auth: typeof auth;
    DatabaseUserAttributes: {
      email: string;
    };
  }
}

export const validateRequest = async (request: { headers?: { cookie?: string } }) => {
  const sessionId = auth.readSessionCookie(request.headers?.cookie ?? '');
  if (!sessionId) {
    return { user: null, session: null };
  }

  const { session, user } = await auth.validateSession(sessionId);
  if (session && session.fresh) {
    // Extend session when it's fresh
    const sessionCookie = auth.createSessionCookie(session.id);
    // You would typically set this cookie in the response header
  }
  if (!session) {
    const sessionCookie = auth.createBlankSessionCookie();
    // You would typically set this cookie in the response header
  }
  return { user, session };
};
