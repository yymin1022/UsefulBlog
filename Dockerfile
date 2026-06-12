# Stage 1: Install dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm install

# Stage 2: Build the application
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept Firebase credentials as build arguments
ARG NEXT_PUBLIC_FB_API_KEY
ARG NEXT_PUBLIC_FB_AUTH_DOMAIN
ARG NEXT_PUBLIC_FB_PROJECT_ID
ARG NEXT_PUBLIC_FB_APP_ID
ARG NEXT_PUBLIC_FB_MEASUREMENT_ID

# Expose build arguments as environment variables for Next.js build process
ENV NEXT_PUBLIC_FB_API_KEY=$NEXT_PUBLIC_FB_API_KEY
ENV NEXT_PUBLIC_FB_AUTH_DOMAIN=$NEXT_PUBLIC_FB_AUTH_DOMAIN
ENV NEXT_PUBLIC_FB_PROJECT_ID=$NEXT_PUBLIC_FB_PROJECT_ID
ENV NEXT_PUBLIC_FB_APP_ID=$NEXT_PUBLIC_FB_APP_ID
ENV NEXT_PUBLIC_FB_MEASUREMENT_ID=$NEXT_PUBLIC_FB_MEASUREMENT_ID

RUN npm run build

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built artifacts and necessary configuration files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Install production-only dependencies using npm ci and clean cache
RUN npm install --only=production && npm cache clean --force

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "start"]
