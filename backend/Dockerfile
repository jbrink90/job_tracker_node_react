FROM node:20-alpine

# Create app user/group
RUN addgroup -S app && adduser -S app -G app

WORKDIR /usr/src/app


COPY package*.json ./
RUN npm install

COPY . .

# Give ownership to app user
RUN chown -R app:app /usr/src/app

RUN mkdir -p /usr/src/app/data \
 && chown -R app:app /usr/src/app/data

# Drop root privileges
USER app

RUN npm run build

CMD ["node", "dist/server.js"]