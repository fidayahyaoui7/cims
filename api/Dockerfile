# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Copy other necessary files
COPY --from=builder /app/.env* ./
COPY --from=builder /app/tsconfig*.json ./

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["node", "dist/index.js"]
