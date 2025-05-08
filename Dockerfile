# Stage 1: Build Frontend
FROM node:20 as frontend-build
WORKDIR /app

COPY tsconfig.base.json ./tsconfig.base.json

# Copy shared code (for frontend use)
COPY ./shared ./shared

# Copy and install frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Shared Code
FROM node:20 as shared-build
WORKDIR /app

COPY tsconfig.base.json ./tsconfig.base.json
# Copy shared code
COPY ./shared ./shared

# Install TypeScript globally in the shared build stage
RUN npm install -g typescript

# Compile the shared code first to generate the necessary .d.ts files
WORKDIR /app/shared
RUN tsc -p ./tsconfig.json  # or similar for shared directory

# Stage 3: Build Backend
FROM node:20 as backend-build
WORKDIR /app

COPY tsconfig.base.json ./tsconfig.base.json
# Copy shared code (compiled)
COPY --from=shared-build /app/shared ./shared

# Copy and install backend
WORKDIR /app/backend
COPY backend/package*.json ./

RUN npm install

# Add a backend build step
COPY backend/ ./
RUN npx tsc  # Backend compilation

# Stage 4: Final Image
FROM node:20 as production

# Copy backend build output
WORKDIR /app
COPY tsconfig.base.json ./tsconfig.base.json
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/package*.json ./backend/
COPY --from=shared-build /app/shared ./shared

# Copy frontend build to nginx
FROM nginx:alpine as nginx-frontend
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Optional: expose only if backend and frontend run together
EXPOSE 5173
EXPOSE 4444

# Start the backend (e.g. Express)
CMD ["node", "backend/dist/server.js"]
