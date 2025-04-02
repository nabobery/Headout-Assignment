# ---- Stage 1: Base Dependencies ----
# Get base node image
FROM node:18-alpine AS base
WORKDIR /app

# ---- Stage 2: Install Dependencies ----
# Install dependencies first for caching
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

# ---- Stage 3: Build Application ----
# Build the application using the installed dependencies
FROM base AS builder
# ARG for next api url - needed during build
ARG _NEXT_PUBLIC_API_URL
# Set ENV for build process
ENV NEXT_PUBLIC_API_URL=$_NEXT_PUBLIC_API_URL
# Copy source code
COPY . .
# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Build the Next.js app
RUN npm run build

# ---- Stage 4: Production Runner ----
# Final, minimal image
FROM base AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
# Uncomment the line below if you want to expose ARG/ENV in the final image (usually not needed for NEXT_PUBLIC_*)
# ENV NEXT_PUBLIC_API_URL=$_NEXT_PUBLIC_API_URL

# Install only production dependencies
COPY package.json package-lock.json* ./
# --omit=dev requires npm v7+, use --production for older versions
RUN npm install --frozen-lockfile --omit=dev

# Copy built artifacts from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Copy next.config.js if you have one and it's needed at runtime
# COPY --from=builder /app/next.config.js ./next.config.js

# Expose the port the app runs on
EXPOSE 3000

# Optional: Add a non-root user for security
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs

# Start the Next.js server
CMD ["npm", "start"]