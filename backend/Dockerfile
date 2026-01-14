FROM node:20-bullseye

# Create group and user with fixed UID/GID
RUN groupadd -g 10001 app \
 && useradd -r -u 10001 -g app app

WORKDIR /usr/src/app

# Create data directory first
RUN mkdir -p /usr/src/app/data \
 && chown -R app:app /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Ensure ownership after copy
RUN chown -R app:app /usr/src/app

# Switch to non-root user
USER app

# Build the project
RUN npm run build

CMD ["node", "dist/server.js"]
