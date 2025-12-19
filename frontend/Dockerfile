# ==============================
# Stage 1: Build frontend
# ==============================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy frontend package files only
COPY frontend/package*.json ./

RUN npm install --legacy-peer-deps

# Copy frontend source
COPY frontend/ ./

# Build production frontend
RUN npm run build:prod

# ==============================
# Stage 2: Serve with nginx
# ==============================
FROM nginx:alpine

COPY frontend/nginx/default.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
