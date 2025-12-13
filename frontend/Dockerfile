# ==============================
# Stage 1: Build frontend
# ==============================
FROM node:20-alpine AS frontend-builder

WORKDIR /usr/src/frontend

# Copy frontend package files and install deps
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Copy shared folder alongside frontend
COPY shared/ ../shared

# Build frontend (Vite + TypeScript can resolve shared imports)
RUN npm run build

# ==============================
# Stage 2: Build backend
# ==============================
FROM node:20-alpine AS backend-builder


WORKDIR /usr/src/backend

# Copy package files first
COPY backend/package*.json ./
RUN npm install

# Copy backend source and shared folder into WORKDIR
COPY backend/src ./src
COPY backend/tsconfig.json ./tsconfig.json
COPY shared/src ../shared/src

# Build backend
RUN npm run build

# ==============================
# Stage 3: Final image
# ==============================
FROM nginx:alpine

WORKDIR /usr/src/app

# Copy frontend build to nginx html folder
COPY --from=frontend-builder /usr/src/frontend/dist /usr/share/nginx/html

# Copy backend build (Node API)
COPY --from=backend-builder /usr/src/backend/dist ./backend

# Expose ports
EXPOSE 80
EXPOSE 4444

# Entrypoint to run both backend and nginx
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
