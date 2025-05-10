FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install Nginx
RUN apk add --no-cache nginx \
 && mkdir -p /etc/nginx/conf.d /run/nginx

# Copy frontend static build to nginx web root
COPY ./frontend/dist /usr/share/nginx/html

# Add Nginx config
COPY nginx.conf /etc/nginx/nginx.conf
RUN echo 'server { \
    listen 5173; \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri /index.html; \
}' > /etc/nginx/conf.d/default.conf

# Copy backend build and package files
COPY ./backend/package*.json ./backend/
COPY ./backend/tsconfig.json ./backend/
COPY . .
RUN cd backend && npm install && npm run build


# Expose frontend (80) and backend (4444)
EXPOSE 5173 4444

# Start backend and nginx
CMD sh -c "nginx -g 'daemon off;' & npm run prod"
