# Book RAG - AI-Powered Physical AI & Robotics Textbook

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/book-rag)

An interactive AI-powered textbook on Physical AI and Humanoid Robotics with RAG (Retrieval-Augmented Generation) chat capabilities. Ask questions and get instant answers with source citations from the book content.

## ✨ Features

- 📚 **Interactive Textbook**: Comprehensive content on Physical AI, ROS 2, NVIDIA Isaac, and Humanoid Robotics
- 🤖 **AI Chat Assistant**: RAG-powered Q&A with context-aware responses
- 🔍 **Smart Search**: Vector similarity search with Qdrant
- 💬 **Chat History**: Persistent conversation storage
- 🎨 **Modern UI**: Built with Docusaurus 3.9.2 and React
- 🔐 **Authentication**: Secure email/password auth with Better Auth
- 📊 **User Preferences**: Customizable theme and settings

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0
- PostgreSQL (Neon DB recommended)
- Qdrant (local or cloud)
- Gemini API key

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/book-rag.git
cd book-rag

# Install dependencies
npm install
cd backend && npm install && cd ..

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Environment Variables

Create `.env.local` in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:pass@host/db

# Authentication
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# AI & Vector DB
GEMINI_API_KEY=your-gemini-api-key
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-qdrant-key
```

### Run Development Servers

```bash
# Terminal 1: Start Qdrant
docker run -p 6333:6333 qdrant/qdrant

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
npm start
```

### Ingest Content

```bash
cd backend
npm run ingest
```

Visit `http://localhost:3000` and start chatting!

## 📖 Documentation

- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture Overview](./specs/book-rag/plan.md)
- [Development Guide](./specs/book-rag/quickstart.md)

## 🏗️ Architecture

```
┌─────────────────┐
│   Docusaurus    │  Frontend (React)
│   Frontend      │  - Chat Widget
└────────┬────────┘  - Book Content
         │
         ↓
┌─────────────────┐
│   Express.js    │  Backend API
│   Backend       │  - Authentication
└────────┬────────┘  - RAG Pipeline
         │
    ┌────┴────┐
    ↓         ↓
┌────────┐ ┌────────┐
│Neon DB │ │ Qdrant │  Data Layer
│(PostgreSQL)│ │(Vectors)│
└────────┘ └────────┘
    ↓
┌─────────────────┐
│  Gemini API     │  AI Model
│  (Embeddings +  │
│   Generation)   │
└─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Docusaurus 3.9.2
- **UI**: React 19.2.1
- **Styling**: Custom CSS

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.21
- **Language**: TypeScript 5.6

### Database
- **Primary**: Neon DB (Serverless PostgreSQL)
- **Vector**: Qdrant 1.9
- **ORM**: Drizzle ORM 0.38

### AI & ML
- **LLM**: Google Gemini (gemini-pro)
- **Embeddings**: Gemini embedding-001
- **Dimension**: 768

### Authentication
- **Library**: Better Auth 1.2.2
- **Methods**: Email/Password, OAuth (Google, GitHub)

## 📊 API Endpoints

### Public
- `GET /api/health` - Health check
- `POST /api/auth/signup/email` - Sign up
- `POST /api/auth/signin/email` - Sign in

### Protected (Auth Required)
- `POST /api/chat` - Send message
- `GET /api/chat/history` - Get conversations
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update preferences

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t book-rag .

# Run container
docker run -p 3000:3000 -p 4000:4000 book-rag
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- Built with [Docusaurus](https://docusaurus.io/)
- Powered by [Google Gemini](https://ai.google.dev/)
- Vector search by [Qdrant](https://qdrant.tech/)
- Database by [Neon](https://neon.tech/)

## 📞 Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/book-rag/issues)

---

**Made with ❤️ for the AI & Robotics community**
