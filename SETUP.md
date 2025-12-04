# Quick Setup Guide

## 1. Environment Variables

Create `.env.local` in the root directory:

```env
# Database (Get from Neon: https://neon.tech)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Better Auth (Generate secret)
BETTER_AUTH_SECRET=<run: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000

# Gemini API (Get from: https://ai.google.dev)
GEMINI_API_KEY=<your-gemini-api-key>

# Qdrant (Local Docker or Cloud)
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
```

## 2. Generate Auth Secret

Run in terminal:
```bash
openssl rand -base64 32
```

Copy the output to `BETTER_AUTH_SECRET` in `.env.local`

## 3. Get API Keys

### Neon DB
1. Go to https://neon.tech
2. Create account and project
3. Copy connection string
4. Add to `DATABASE_URL`

### Gemini API
1. Go to https://ai.google.dev
2. Get API key
3. Add to `GEMINI_API_KEY`

## 4. Start Services

```bash
# Terminal 1: Qdrant
docker run -p 6333:6333 qdrant/qdrant

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend
npm start
```

## 5. Run Migrations

```bash
cd backend
npx @better-auth/cli migrate
```

## 6. Ingest Content

```bash
cd backend
npm run ingest
```

## 7. Test

Visit: http://localhost:3000
