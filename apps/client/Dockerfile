# Base image with Alpine and pnpm
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@12.2.1 --activate
WORKDIR /app

# -----------------------------------------------------------
# Stage: Development (Hot Reloading)
# -----------------------------------------------------------
FROM base AS development
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/main/package.json ./apps/main/package.json
RUN pnpm install
COPY . .

ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000
CMD ["pnpm", "--filter", "main", "dev"]

# -----------------------------------------------------------
# Stage: Prune workspace for main app production build
# -----------------------------------------------------------
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune main --docker

# -----------------------------------------------------------
# Stage: Install production dependencies
# -----------------------------------------------------------
FROM base AS dependencies
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# -----------------------------------------------------------
# Stage: Build production bundle
# -----------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/out/json/ .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MAIN_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_MAIN_URL=${NEXT_PUBLIC_MAIN_URL}

RUN pnpm --filter=main build

# -----------------------------------------------------------
# Stage: Production runner
# -----------------------------------------------------------
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@12.2.1 --activate

COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/packages ./packages
COPY --from=builder --chown=nextjs:nodejs /app/apps/main ./apps/main
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml

USER nextjs
EXPOSE 3000
CMD ["pnpm", "--filter", "main", "start"]
