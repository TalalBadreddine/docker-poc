# 03 - Real-World Example (Multi-Stage Build)

This is how a real company Dockerizes a Next.js app — using **multi-stage builds**.

## Why multi-stage?
A single-stage build would include everything: source code, devDependencies, build tools.
That means a huge image with stuff you don't need at runtime.

Multi-stage = build in one container, copy only what you need into a clean final container.

## The 3 stages in our Dockerfile

### Stage 1: Dependencies (`deps`)
```dockerfile
FROM node:24-alpine AS deps
COPY package.json yarn.lock* ./
RUN yarn install
```
Only installs dependencies. Cached until `package.json` changes.

### Stage 2: Build (`build`)
```dockerfile
FROM node:24-alpine AS build
COPY --from=deps /deps/node_modules ./node_modules
COPY . .
RUN yarn build
```
Copies deps from stage 1, copies source code, builds the app.

### Stage 3: Runtime (`runtime`)
```dockerfile
FROM node:24-alpine AS runtime
COPY --from=build /build/.next/standalone ./
COPY --from=build /build/.next/static ./.next/static
COPY --from=build /build/public ./public
USER node
CMD ["node", "server.js"]
```
Clean image with ONLY the production output. No source code, no devDependencies, no build tools.

## What gets thrown away
- Source code (pages/, etc.) — not needed, it's compiled
- node_modules from dev — only standalone deps are copied
- Build tools (webpack, etc.) — only needed during build
- Python and other OS packages — stripped with `apk del`

## Build & run
```bash
docker build -t real-world .
docker run --rm -p 3000:3000 real-world
```
Open http://localhost:3000

## Compare image sizes
```bash
# Single-stage would be ~500MB+
# Our multi-stage image:
docker images real-world    # ~150MB or less
```

## Security practices used
- `USER node` — runs as non-root
- `--chown=node:node` — files owned by non-root user
- `apk del python3` — removes unnecessary packages
- `poweredByHeader: false` — hides framework info
- `.dockerignore` — prevents node_modules/.git from entering the build
