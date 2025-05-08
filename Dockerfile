# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Ensure NODE_ENV is NOT set to production
ENV NODE_ENV=development

# Copy and install workspace dependencies
COPY package*.json ./
COPY ./frontend/package*.json ./frontend/
COPY ./backend/package*.json ./backend/
RUN npm install

# Copy entire monorepo
COPY . .

# Expose Vite and backend ports
EXPOSE 5173 4444

CMD ["npm", "run", "dev"]
