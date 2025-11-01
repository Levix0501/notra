# Multi-stage Docker build for Next.js application
# This Dockerfile uses a multi-stage build to optimize the final image size

# Stage 1: Install dependencies
# Build dependencies stage to install all required packages
FROM node:24-alpine AS dependencies
WORKDIR /app

COPY ./package.json ./
COPY ./pnpm-lock.yaml ./

RUN npm install pnpm -g
RUN pnpm install --frozen-lockfile

# Stage 2: Build the application
# Builder stage to compile and build the Next.js application
FROM node:24-alpine AS builder
WORKDIR /app

ENV IS_DOCKER 1

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm install pnpm -g
RUN pnpm db:generate
RUN pnpm next:build 

# Stage 3: Production runtime
# Final stage with minimal runtime requirements
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV "production"
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/.next/static ./standalone/.next/static
COPY --from=builder /app/public ./standalone/public

COPY ./prisma ./prisma
COPY ./prisma/package.json ./package.json
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install pnpm -g
RUN pnpm install

COPY ./scripts/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]

CMD pnpm db:deploy && node ./standalone/server.js
