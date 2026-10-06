# Simple dev Dockerfile for server-auth
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate || true
COPY src ./src
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "src/server.js"]
