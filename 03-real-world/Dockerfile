# ==============================================================================
# Stage 1: Dependencies
# ==============================================================================
FROM node:24-alpine3.23 AS deps

WORKDIR /deps

COPY package.json yarn.lock* ./

RUN yarn install

# ==============================================================================
# Stage 2: Build
# ==============================================================================
FROM node:24-alpine3.23 AS build

WORKDIR /build

# Bring in dependencies from previous stage
COPY --from=deps /deps/node_modules ./node_modules
COPY --from=deps /deps/package.json ./

# Copy source code
COPY next.config.js ./
COPY pages ./pages
COPY public ./public

# Build the Next.js application (produces .next/standalone)
RUN yarn build

# ==============================================================================
# Stage 3: Runtime (production image)
# ==============================================================================
FROM node:24-alpine3.23 AS runtime

# Remove unnecessary packages and prepare app directory
RUN apk del -r python3 \
    && mkdir -p /app \
    && chown -R node:node /app

WORKDIR /app

# Copy standalone server (includes node_modules + server.js)
COPY --from=build --chown=node:node /build/.next/standalone ./

# Copy static assets (not included in standalone output)
COPY --from=build --chown=node:node /build/.next/static ./.next/static

# Copy public assets
COPY --from=build --chown=node:node /build/public ./public

# Run as non-root
USER node

EXPOSE 3000

CMD ["node", "server.js"]
