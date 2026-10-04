# Base image with Alpine and pnpm
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@12.2.1 --activate
WORKDIR /app

ARG APP=client

# -----------------------------------------------------------
# Stage: Development (Hot Reloading)
# -----------------------------------------------------------
FROM base AS development
ARG APP
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/${APP}/package.json ./apps/${APP}/package.json
RUN pnpm install
COPY . .

ENV NODE_ENV=development
ENV APP=${APP}

EXPOSE 3000 3001 3003 3004 8000
CMD ["sh", "-c", "pnpm --filter ${APP} dev"]

# -----------------------------------------------------------
# Stage: Prune workspace for production build
# -----------------------------------------------------------
FROM base AS pruner
ARG APP
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune ${APP} --docker

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
ARG APP
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/out/json/ .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MAIN_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_MAIN_URL=${NEXT_PUBLIC_MAIN_URL}

RUN pnpm --filter=${APP} build

# -----------------------------------------------------------
# Stage: Production runner
# -----------------------------------------------------------
FROM node:22-alpine AS production
ARG APP
WORKDIR /app

ENV NODE_ENV=production
ENV APP=${APP}

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@12.2.1 --activate

COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/packages ./packages
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP} ./apps/${APP}
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml

USER nextjs
EXPOSE 3000 3001 3003 3004 8000
CMD ["sh", "-c", "pnpm --filter ${APP} start"]
