# ==============================
# Stage 1: Build frontend
# ==============================
FROM node:20-alpine AS builder

WORKDIR /app

COPY frontend/ ./

RUN npm install --legacy-peer-deps

# Build frontend
RUN npm run build

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
