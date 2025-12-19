FROM node:20-alpine

# Create app user with fixed UID/GID (VERY IMPORTANT)
RUN addgroup -g 10001 app \
 && adduser -S -u 10001 -G app app

WORKDIR /usr/src/app

# Create data directory FIRST
RUN mkdir -p /usr/src/app/data \
 && chown -R app:app /usr/src/app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Ensure ownership after copy
RUN chown -R app:app /usr/src/app

# Drop root
USER app

RUN npm run build

CMD ["node", "dist/server.js"]
