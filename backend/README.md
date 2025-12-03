# Book RAG Backend API

Backend API server for Book RAG project with authentication and RAG pipeline.

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create `.env` file in backend directory:
```env
DATABASE_URL=postgresql://user:password@host/database
BETTER_AUTH_SECRET=your-32-char-hex-secret
BETTER_AUTH_URL=http://localhost:4000
PORT=4000

# Optional: Gemini API
GEMINI_API_KEY=your-key

# Optional: Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-key
```

### 3. Run Development Server
```bash
npm run dev
```

Server will start at `http://localhost:4000`

### 4. Run Frontend & Backend Together
From root directory:
```bash
npm run dev:all
```

## API Endpoints

### Authentication

#### Health Check
```
GET /api/health
Response: { status: "ok", timestamp: "..." }
```

#### Get Session
```
GET /api/auth/session
Response: { authenticated: true, session: {...} }
```

#### Signup
```
POST /api/auth/signup/email
Body: { email, password, name }
Response: { success: true, message: "..." }
```

#### Login
```
POST /api/auth/signin/email
Body: { email, password }
Response: { success: true, message: "..." }
```

#### Logout
```
POST /api/auth/signout
Response: { success: true, message: "Logged out successfully" }
```

### Chat/RAG (Planned)

#### Send Message
```
POST /api/chat
Auth: Required (session token)
Body: { message: "What is ROS 2?" }
Response: { response: "...", sources: [...] }
```

#### Get History
```
GET /api/chat/history
Auth: Required
Response: { history: [...] }
```

## Project Structure

```
backend/
├── src/
│   └── server.ts          # Main Express app
├── dist/                  # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### File Watcher
```bash
npm run dev
```

### Type Checking
```bash
npm run type-check
```

### Build
```bash
npm run build
npm start
```

## Integration with Frontend

The frontend (Docusaurus) makes requests to this backend:

```
Frontend: http://localhost:3000
Backend: http://localhost:4000

Frontend form submission
  → POST http://localhost:4000/api/auth/signup/email
  → Backend validates and creates user
  → Returns session token in cookie
  → Frontend redirects to home
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | Neon connection string |
| `BETTER_AUTH_SECRET` | Yes | - | Session encryption key |
| `BETTER_AUTH_URL` | No | http://localhost:4000 | Auth service URL |
| `PORT` | No | 4000 | Server port |
| `GEMINI_API_KEY` | No | - | Google Gemini API key |
| `QDRANT_URL` | No | - | Qdrant vector DB URL |
| `QDRANT_API_KEY` | No | - | Qdrant API key |

## Troubleshooting

### "Cannot find module"
```bash
npm install
```

### "PORT already in use"
```bash
# Change PORT in .env or kill process on port 4000
npx kill-port 4000
npm run dev
```

### "DATABASE_URL is required"
Check `.env` file has correct connection string

### CORS errors
Verify `BETTER_AUTH_URL` matches frontend URL

## Next Steps

1. Implement OAuth callbacks
2. Add RAG pipeline integration
3. Setup email verification
4. Add logging and error handling
5. Deploy to production (Heroku, Vercel, Railway, etc.)

## Resources

- [Express.js](https://expressjs.com)
- [better-auth](https://better-auth.vercel.app)
- [Drizzle ORM](https://orm.drizzle.team)
- [Neon Docs](https://neon.tech/docs)
