# Stage 1: Build Frontend
FROM node:20 as frontend-build
WORKDIR /app

# Copy shared code (for frontend use)
COPY ./shared ./shared

# Copy and install frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:20 as backend-build
WORKDIR /app

# Copy shared code (for backend use)
COPY ./shared ./shared

# Copy and install backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

# Add a backend build step
COPY backend/ ./
RUN npx tsc

# Stage 3: Final Image
FROM node:20 as production

# Copy backend build output
WORKDIR /app
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/package*.json ./backend/
COPY --from=backend-build /app/shared ./shared

# Copy frontend build to nginx
FROM nginx:alpine as nginx-frontend
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Optional: expose only if backend and frontend run together
EXPOSE 5173
EXPOSE 4444

# Start the backend (e.g. Express)
CMD ["node", "backend/dist/server.js"]
