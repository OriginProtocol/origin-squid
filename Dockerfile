# syntax=docker/dockerfile:1.7

# ---- builder ----------------------------------------------------------------
FROM node:20-bookworm-slim AS builder

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

WORKDIR /app

# Install dependencies first to maximize layer cache reuse.
COPY package.json pnpm-lock.yaml .npmrc* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Copy the rest of the source and build.
COPY tsconfig.json commands.json ./
COPY src ./src
COPY abi ./abi
COPY db ./db
COPY scripts ./scripts
COPY schema.graphql ./schema.graphql

RUN pnpm run build

# ---- runtime ----------------------------------------------------------------
FROM node:20-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV TS_NODE_BASEURL=./lib
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

WORKDIR /app

# Subsquid's squid-graphql-server is invoked via npx; bring node_modules from the
# builder so we don't need a network install at runtime.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/db ./db
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/schema.graphql ./schema.graphql
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/commands.json ./commands.json
COPY --from=builder /app/package.json ./package.json

RUN chmod +x scripts/run-with-backoff.sh scripts/serve.sh scripts/entrypoint.sh

# All services run the same image. Each Railway service sets SERVICE_ROLE
# (api | processor | migrate); entrypoint.sh dispatches accordingly.
EXPOSE 4350
CMD ["./scripts/entrypoint.sh"]
