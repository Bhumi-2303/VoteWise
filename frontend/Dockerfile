# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules if needed
RUN apk add --no-cache libc6-compat

# Copy package files for better caching
COPY frontend/package*.json ./
RUN npm install --frozen-lockfile || npm install

# Copy source and build
COPY frontend/ .
RUN npm run build

# --- Final Stage ---
FROM node:20-alpine

WORKDIR /app

# Production environment
ENV NODE_ENV=production
ENV PORT=8080

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
# Note: In standalone mode, Next.js copies everything needed to .next/standalone
# But we'll stick to a more standard production copy for now
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Set permissions
RUN chown -R nextjs:nodejs /app/.next

USER nextjs

EXPOSE 8080

# Start the Next.js server on port 8080
# Explicitly binding to 0.0.0.0
CMD ["npm", "start", "--", "-p", "8080"]
