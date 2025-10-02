# -------------------
# Base image (shared setup)
# -------------------
FROM node:22-alpine AS base
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm

# -------------------
# Development runtime (hot reload)
# -------------------
FROM base AS development
ENV NODE_ENV=development
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3100
CMD ["pnpm", "run", "start:dev"]

# -------------------
# Production runtime (small, pruned)
# -------------------
FROM base AS production
ENV NODE_ENV=production
COPY . .
RUN pnpm install --frozen-lockfile && pnpm run build:prod && pnpm prune --prod
EXPOSE 3100
CMD ["pnpm", "run", "start:prod:trace"]

