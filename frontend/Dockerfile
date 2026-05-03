# --- Build Stage ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files for better caching
COPY frontend/package*.json ./
RUN npm install

# Copy source and build
COPY frontend/ .
RUN npm run build

# --- Final Stage ---
FROM node:18-alpine

WORKDIR /app

# Production environment
ENV NODE_ENV=production
ENV PORT=8080

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080

# Start the Next.js server on port 8080
CMD ["npm", "start", "--", "-p", "8080"]
