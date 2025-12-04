# Deployment Guide

## Prerequisites

- Node.js 20+
- PostgreSQL database (Neon recommended)
- Qdrant instance (cloud or self-hosted)
- Gemini API key
- Vercel account (for frontend) or VPS

---

## Environment Setup

### Required Environment Variables

Create `.env.local` (or `.env.production`):

```env
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Authentication
BETTER_AUTH_SECRET=<generate-with-openssl-rand-hex-32>
BETTER_AUTH_URL=https://your-domain.com

# AI & Vector DB
GEMINI_API_KEY=<your-gemini-api-key>
QDRANT_URL=https://your-qdrant-instance.com
QDRANT_API_KEY=<your-qdrant-api-key>

# Backend
PORT=4000
NODE_ENV=production
```

---

## Option 1: Vercel Deployment (Recommended)

### Frontend (Docusaurus)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Configure `vercel.json`**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "docusaurus",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-backend.com"
  }
}
```

3. **Deploy**:
```bash
vercel --prod
```

### Backend (Express)

**Option A: Vercel Serverless**

1. Create `api/index.ts`:
```typescript
import app from '../backend/src/server';
export default app;
```

2. Add to `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" }
  ]
}
```

**Option B: Separate VPS/Cloud**

Deploy backend to Railway, Render, or DigitalOcean:

```bash
# Railway
railway up

# Render
render deploy

# DigitalOcean App Platform
doctl apps create --spec .do/app.yaml
```

---

## Option 2: Docker Deployment

### Build Images

**Frontend**:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "serve"]
```

**Backend**:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4000

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "4000:4000"
    env_file:
      - .env.production
    depends_on:
      - qdrant

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  qdrant_data:
```

**Deploy**:
```bash
docker-compose up -d
```

---

## Database Setup

### Neon DB (Recommended)

1. Create project at [neon.tech](https://neon.tech)
2. Copy connection string
3. Run migrations:

```bash
cd backend
npm run db:generate
npm run db:push
```

### Self-Hosted PostgreSQL

```bash
# Create database
createdb book_rag

# Run migrations
cd backend
DATABASE_URL=postgresql://localhost/book_rag npm run db:push
```

---

## Vector Database Setup

### Qdrant Cloud

1. Create cluster at [cloud.qdrant.io](https://cloud.qdrant.io)
2. Copy URL and API key
3. Update `.env.production`

### Self-Hosted Qdrant

```bash
docker run -p 6333:6333 \
  -v $(pwd)/qdrant_storage:/qdrant/storage \
  qdrant/qdrant
```

---

## Content Ingestion

After deployment, ingest book content:

```bash
cd backend
npm run ingest
```

**Monitor progress**:
- Check logs for completion
- Verify vector count in Qdrant dashboard
- Test search with sample queries

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          npm ci
          cd backend && npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Monitoring & Logging

### Application Monitoring

**Vercel Analytics**:
```bash
npm i @vercel/analytics
```

**Sentry (Error Tracking)**:
```bash
npm i @sentry/node @sentry/react
```

### Logging

**Production Logs**:
```bash
# Vercel
vercel logs

# Docker
docker-compose logs -f backend

# Railway
railway logs
```

---

## Performance Optimization

### Frontend

1. **Enable compression**:
```javascript
// docusaurus.config.js
module.exports = {
  plugins: [
    ['@docusaurus/plugin-pwa', {
      offlineModeActivationStrategies: ['appInstalled', 'standalone'],
    }],
  ],
};
```

2. **Optimize images**:
```bash
npm i sharp
```

### Backend

1. **Enable caching**:
```typescript
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 });
```

2. **Connection pooling**:
```typescript
// Already configured in Neon serverless
```

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SQL injection prevention (Drizzle ORM)
- [ ] XSS protection (httpOnly cookies)
- [ ] CSRF protection
- [ ] Dependency audit (`npm audit`)

---

## Troubleshooting

### Common Issues

**Database Connection Failed**:
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

**Qdrant Connection Failed**:
```bash
# Test endpoint
curl http://your-qdrant-url:6333/collections
```

**Build Failures**:
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

---

## Rollback Procedure

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback <deployment-url>
```

### Docker

```bash
# Revert to previous image
docker-compose down
docker-compose up -d --force-recreate
```

---

## Support

- 📧 Email: devops@example.com
- 📖 Docs: [docs.example.com](https://docs.example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/book-rag/issues)
