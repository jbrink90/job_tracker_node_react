# ---------- Stage 1: Builder ----------
    FROM node:20-alpine AS builder

    WORKDIR /usr/src/app
    
    COPY package*.json ./
    RUN npm install
    
    # Copy backend AND shared folders
    COPY backend ./backend
    COPY shared ./shared

    # If your tsconfig.json extends from root, copy it too
    COPY tsconfig.json ./tsconfig.json
    
    WORKDIR /usr/src/app/backend
    RUN npm run build
    
    # ---------- Stage 2: Runtime ----------
    FROM node:20-alpine
    
    WORKDIR /usr/src/app
    
    # Copy built dist from builder stage
    COPY --from=builder /usr/src/app/dist ./dist
    COPY package*.json ./
    
    # Install production deps only
    RUN npm install --production
    
    # Ensure data folder exists for SQLite
    RUN mkdir -p /usr/src/app/data
    
    EXPOSE 4444
    
    CMD ["node", "dist/backend/src/server.js"]
    