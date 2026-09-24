# ==============================================================================
# LexiGuard AI — Production Multi-Stage Dockerfile
# ==============================================================================

# Stage 1: Build Dependencies and Compilations
FROM node:20-alpine AS builder

WORKDIR /app

# Install build essentials and OpenSSL for Prisma on Alpine Linux
RUN apk add --no-cache python3 make g++ openssl libc6-compat

# Copy root workspace configurations
COPY package.json package-lock.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install all workspace dependencies
RUN npm install

# Copy source code across all workspaces
COPY shared/ ./shared/
COPY server/ ./server/
COPY client/ ./client/

# Build shared types, server backend, and frontend client
ENV NODE_ENV=production
RUN npm run build:shared
RUN npm --workspace=server run prisma:generate
RUN npm run build:server
RUN npm run build:client

# ==============================================================================
# Stage 2: Production Runtime Image
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Install curl for Docker healthchecks & openssl + libc6-compat for Prisma
RUN apk add --no-cache curl openssl libc6-compat

ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL="file:/app/server/prisma/dev.db"

# Create non-root system group & user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S lexiguard -u 1001

# Copy compiled artifacts and production dependencies
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist

# Copy entrypoint script
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Ensure storage directories exist with universal write permissions
RUN mkdir -p /app/server/uploads /app/server/prisma && \
    chmod -R 777 /app/server/uploads /app/server/prisma && \
    chown -R lexiguard:nodejs /app

USER lexiguard

EXPOSE 5000

# Docker Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "--workspace=server", "start"]
