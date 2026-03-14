# ─────────────────────────────────────────
# Stage 1: Build frontend
# ─────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build


# ─────────────────────────────────────────
# Stage 2: Build backend
# ─────────────────────────────────────────
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package.json ./
RUN npm install

COPY backend/ ./


# ─────────────────────────────────────────
# Stage 3: Final runtime image
# ─────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy backend with its node_modules
COPY --from=backend-builder /app/backend ./backend

# Copy built frontend static files into backend/public
COPY --from=frontend-builder /app/frontend/dist ./backend/public

WORKDIR /app/backend

EXPOSE 3001

CMD ["npx", "tsx", "server.ts"]