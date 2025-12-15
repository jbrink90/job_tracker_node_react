# ==============================
# Stage 1: Build frontend
# ==============================
FROM node:20-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy package files first (for caching installs)
COPY package*.json ./

# Install dependencies (handle peer deps)
RUN npm install --legacy-peer-deps

# Copy all frontend source files
COPY . .

# Build the frontend app
RUN npm run build:prod

# ==============================
# Stage 2: Serve with nginx
# ==============================
FROM nginx:alpine

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy build from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Fix permissions for all files and folders so nginx can read them
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
