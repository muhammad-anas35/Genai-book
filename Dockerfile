# Multi-stage build for production

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build backend
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build

# Stage 3: Production runtime
FROM node:20-alpine
WORKDIR /app

# Install serve for frontend
RUN npm install -g serve

# Copy frontend build
COPY --from=frontend-builder /app/build /app/frontend/build

# Copy backend build
COPY --from=backend-builder /app/dist /app/backend/dist
COPY --from=backend-builder /app/node_modules /app/backend/node_modules
COPY --from=backend-builder /app/package.json /app/backend/

# Expose ports
EXPOSE 3000 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start script
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

CMD ["/app/docker-entrypoint.sh"]
