# syntax=docker/dockerfile:1.7

# ---- builder ----------------------------------------------------------------
FROM node:20-bookworm-slim AS builder

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

# better-sqlite3 publishes no prebuilt binary for node 20 on linux/x64, so its
# binding has to be compiled here. Only the builder needs the toolchain.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first to maximize layer cache reuse.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY patches ./patches
# @originprotocol/* resolves from GitHub Packages, which requires a token even
# for public packages. Railway exposes service variables to the build as ARGs.
ARG NODE_AUTH_TOKEN
# Note: no `--mount=type=cache` here — Railway's BuildKit rejects custom cache
# IDs without their internal cacheKey prefix. Docker layer caching still applies.
RUN printf '//npm.pkg.github.com/:_authToken=%s\n' "$NODE_AUTH_TOKEN" >> .npmrc \
  && pnpm install --frozen-lockfile \
  && sed -i '/_authToken/d' .npmrc

# better-sqlite3 publishes no prebuilt binary for node 20 on linux/x64, and
# `pnpm rebuild` silently declines to run its install script while `.npmrc` sets
# ignore-scripts=true, so node-gyp is invoked directly. The check opens a database
# rather than requiring the module: the binding loads on `new Database`, so a bare
# require() succeeds without it and hides a missing binding until runtime.
RUN BS="$(node -p "require('path').dirname(require.resolve('better-sqlite3/package.json'))")" \
  && cd "$BS" \
  && npx --yes node-gyp rebuild --release \
  && cd /app \
  && node -e "new (require('better-sqlite3'))(':memory:')"

# Copy the rest of the source and build.
COPY tsconfig.json commands.json ./
COPY src ./src
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

# Fails the build if the compiled binding did not survive the node_modules copy;
# without it the RPC and Portal caches throw "Could not locate the bindings file"
# on their first open, which surfaces only as a restart loop at runtime.
RUN node -e "new (require('better-sqlite3'))(':memory:')"

RUN chmod +x scripts/run-with-backoff.sh scripts/serve.sh scripts/entrypoint.sh

# All services run the same image. Each Railway service sets SERVICE_ROLE
# (api | processor | migrate); entrypoint.sh dispatches accordingly.
EXPOSE 4350
CMD ["./scripts/entrypoint.sh"]
