# Better Auth & Neon Database Setup - Complete Guide

**Project**: Physical AI & Humanoid Robotics Book RAG  
**Date**: December 4, 2025  
**Status**: ✅ Configured

---

## Overview

Your project now integrates:
- **better-auth** - Modern authentication library replacing NextAuth.js
- **Neon Database** - Serverless PostgreSQL
- **Drizzle ORM** - Type-safe database queries
- **OAuth Support** - Google and GitHub login

---

## 📋 Installation Status

### ✅ Completed
- Dependencies installed (`better-auth`, `drizzle-orm`, `@neondatabase/serverless`)
- Database schema defined (`src/db/schema.ts`)
- Authentication config created (`src/lib/auth.ts`)
- Drizzle ORM setup (`src/db/index.ts`)
- Login/Signup UI pages created with styling
- Environment variables template provided

### 🔄 Remaining Steps
1. Create `.env.local` with your credentials
2. Initialize Neon database
3. Create API route handlers
4. Connect auth UI to backend

---

## 🚀 Quick Start (5 minutes)

### Step 1: Setup Environment
```bash
# Copy the example file
cp .env.local.example .env.local

# Generate a secure secret (paste output into .env.local)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Configure Neon Database
1. Go to https://neon.tech and sign up
2. Create a new project
3. Copy the connection string from "Connection string" section
4. Paste into `.env.local` as `DATABASE_URL`

### Step 3: Initialize Database Tables
```bash
npm run db:push
```

### Step 4: Start Development
```bash
npm start
```

---

## 🔑 Environment Variables

### Required
```env
DATABASE_URL=postgresql://user:password@host/database
BETTER_AUTH_SECRET=<32-character-hex-string>
```

### Optional (OAuth)
```env
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
GITHUB_CLIENT_ID=<your-client-id>
GITHUB_CLIENT_SECRET=<your-client-secret>
```

---

## 📊 Database Schema

### users table
```sql
- id (text, PRIMARY KEY)
- email (text, UNIQUE, NOT NULL)
- name (text)
- passwordHash (text)
- emailVerified (boolean, DEFAULT false)
- createdAt (timestamp, DEFAULT now)
- updatedAt (timestamp, DEFAULT now)
```

### sessions table
```sql
- id (text, PRIMARY KEY)
- userId (text, FOREIGN KEY → users.id)
- expiresAt (timestamp, NOT NULL)
- createdAt (timestamp, DEFAULT now)
```

### chat_history table
```sql
- id (text, PRIMARY KEY)
- userId (text, FOREIGN KEY → users.id)
- message (text, NOT NULL)
- response (text, NOT NULL)
- createdAt (timestamp, DEFAULT now)
```

---

## 🔐 Authentication Flow

### Email/Password Registration
```
User submits signup form
  ↓
Client sends POST /api/auth/signup/email
  ↓
Server validates email & password
  ↓
Create user in database
  ↓
Generate session token
  ↓
Return session to client
```

### OAuth (Google/GitHub)
```
User clicks "Login with Google"
  ↓
Redirect to Google OAuth consent
  ↓
User grants permission
  ↓
Google redirects back with authorization code
  ↓
Server exchanges code for user profile
  ↓
Create/update user in database
  ↓
Generate session token
  ↓
Redirect to home page
```

---

## 📁 Project Structure

```
src/
├── db/
│   ├── index.ts           ← Neon connection
│   ├── schema.ts          ← Database tables
│   └── users.ts           ← User queries (optional)
├── lib/
│   ├── auth.ts            ← better-auth config
│   └── session.ts         ← Session management
└── pages/
    ├── auth/
    │   ├── auth.module.css
    │   ├── login.tsx
    │   └── signup.tsx
    └── index.tsx
```

---

## 🛠️ Useful Commands

```bash
# Development
npm start                 # Start dev server (localhost:3000)

# Database
npm run db:generate       # Generate migration files
npm run db:push          # Apply migrations to database
npm run db:studio        # Open Drizzle Studio (GUI)

# Build
npm run build            # Build for production
npm run serve            # Serve production build

# Type checking
npm typecheck            # Check TypeScript errors
```

---

## 🔗 API Routes to Create

### Authentication Routes (need to be implemented)
- `POST /api/auth/signup/email` - Register with email
- `POST /api/auth/signin/email` - Login with email
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current user session
- `GET /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/callback/github` - GitHub OAuth callback

### Chat Routes (for RAG - future)
- `POST /api/chat` - Send message to RAG
- `GET /api/chat/history` - Get conversation history
- `DELETE /api/chat/:id` - Delete conversation

---

## 🧪 Testing

### Test Signup
1. Go to http://localhost:3000/signup
2. Fill in the form
3. Click "Create Account"
4. Should see success or error message

### Test Login
1. Go to http://localhost:3000/login
2. Enter credentials from signup
3. Click "Login"
4. Should be redirected to home page

### Verify in Database
```bash
npm run db:studio
# View users table to confirm user was created
```

---

## 🐛 Troubleshooting

### "Can't find module @neondatabase/serverless"
```bash
npm install
```

### "DATABASE_URL is required"
1. Check `.env.local` exists
2. Verify `DATABASE_URL` is set
3. Restart dev server

### "Connection refused to database"
1. Verify URL format: `postgresql://user:pass@host/db`
2. Check Neon dashboard - database should be active
3. Ensure firewall allows connections

### Auth pages not loading
1. Verify `auth.module.css` exists
2. Clear `.docusaurus` cache: `npm run clear`
3. Restart dev server: `npm start`

### OAuth not working
1. Verify Client ID/Secret in `.env.local`
2. Check redirect URIs match exactly in provider settings
3. Ensure `BETTER_AUTH_URL` is correct

---

## 📚 Resources

- **better-auth docs**: https://better-auth.vercel.app
- **Neon docs**: https://neon.tech/docs
- **Drizzle ORM docs**: https://orm.drizzle.team
- **GitHub Repo**: https://github.com/muhammad-anas35/RAGai

---

## Next Steps

1. ✅ Create `.env.local` with Neon credentials
2. ✅ Run `npm run db:push` to initialize database
3. 🔄 Create API route handlers (Vercel Functions or Node.js API)
4. 🔄 Test signup/login flow
5. 🔄 Implement RAG chat API
6. 🔄 Deploy to production

---

**Maintained by**: Muhammad Anas Asif  
**Last Updated**: December 4, 2025
