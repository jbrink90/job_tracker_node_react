FROM node:20-alpine

WORKDIR /usr/src/app

COPY backend/package*.json ./
RUN npm install --production

COPY backend/dist ./dist

EXPOSE 4444

CMD ["node", "dist/src/server.js"]
