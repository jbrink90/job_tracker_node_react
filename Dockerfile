# Stage 1: Build Frontend
FROM node:20 AS frontend-build
WORKDIR /app

# Copy shared code (for frontend use)
COPY ./shared ./shared

# Copy and install frontend dependencies
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

# Copy frontend source code and build the frontend
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Shared Code
FROM node:20 AS shared-build
WORKDIR /app

# Copy shared code (e.g., utilities, types, etc.) for compilation
COPY ./shared ./shared

# Install TypeScript globally to compile shared code
RUN npm install -g typescript

# Compile the shared code to generate necessary .d.ts files
WORKDIR /app/shared
RUN tsc -p ./tsconfig.json  # Compile shared code (adjust if necessary)

# Stage 3: Build Backend
FROM node:20 AS backend-build
WORKDIR /app

# Copy compiled shared code from the shared-build stage
COPY --from=shared-build /app/shared ./shared

# Install backend dependencies
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

# Copy backend source code and build the backend
COPY backend/ ./
RUN npx tsc  # Compile backend code

# Stage 4: Production Image for Backend and Frontend
FROM node:20 AS production

# Copy backend build output (compiled code) to the production container
WORKDIR /app
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/package*.json ./backend/
COPY --from=shared-build /app/shared ./shared

# Stage 5: Nginx for Frontend
FROM nginx:alpine AS nginx-frontend
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Expose the ports for frontend and backend
EXPOSE 5173
EXPOSE 4444

# Start the backend (e.g., Express)
CMD ["node", "backend/dist/server.js"]
