# ── База ──────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN npm install -g pnpm@11.28.5
WORKDIR /app

# ── Зависимости ──────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ── Сборка ───────────────────────────────────────────────────────────────────
FROM base AS builder
ENV DOCKER_BUILD=1 NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ── Runtime ──────────────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
WORKDIR /app
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/src/db/migrations ./src/db/migrations
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
