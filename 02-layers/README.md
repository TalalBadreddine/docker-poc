# 02 - Layers, Secrets, USER & Volumes

## Key concept
Every Dockerfile instruction (FROM, COPY, RUN) creates a **layer**.
Docker **caches** layers and only rebuilds from the first changed layer downward.

## Build & run
```bash
docker build -t layers-demo .
docker run --rm layers-demo
```

## See the layers
```bash
docker history layers-demo
```

## Test the cache
1. Change the message in `index.js`
2. Rebuild: `docker build -t layers-demo .`
3. Notice: `npm install` says **CACHED** — only the COPY . layer re-runs

---

## Secrets in layers — THE DANGER

Layers are **permanent**. Even if you delete a file in a later layer, it still exists in the previous one.

### Bad — secret baked into a layer forever:
```dockerfile
COPY .env .                         # layer stores .env
RUN cat .env && rm .env             # .env is GONE from the filesystem
                                    # but STILL in the COPY layer above!
```

Anyone can extract it:
```bash
docker history layers-demo          # see all layers
docker save layers-demo | tar -x    # extract and inspect every layer
```

### Good — pass secrets at runtime:
```bash
docker run -e DB_PASSWORD=hunter2 layers-demo
```

### Good — use build secrets (never stored in layers):
```dockerfile
RUN --mount=type=secret,id=db_pass cat /run/secrets/db_pass
```
```bash
docker build --secret id=db_pass,src=./password.txt -t myapp .
```

---

## USER — don't run as root

By default containers run as **root**. If an attacker exploits your app, they get root inside the container.

### What we do in the Dockerfile:
```dockerfile
RUN chown -R node:node /app    # give ownership to non-root user
USER node                       # switch to non-root for runtime
```

### Verify it works:
```bash
docker run --rm layers-demo
# Output: "Running as user: node (uid: 1000)"
```

### Compare with root:
```bash
docker run --rm --user root layers-demo
# Output: "Running as user: root (uid: 0)"
```

---

## Volumes — persist data across containers

Without a volume, everything inside a container is **gone** when it's removed.

### Run without volume (logs disappear):
```bash
docker run --rm layers-demo
docker run --rm layers-demo
# Both show "1 entries total" — nothing persists
```

### Run with a named volume (logs persist):
```bash
docker run --rm -v demo-logs:/app/logs layers-demo
docker run --rm -v demo-logs:/app/logs layers-demo
docker run --rm -v demo-logs:/app/logs layers-demo
# Shows 1, then 2, then 3 entries — logs accumulate!
```

### Volume + USER gotcha
The `/app/logs` directory must be created and owned by `node` **before** `USER node`:
```dockerfile
RUN mkdir -p /app/logs && chown node:node /app/logs   # as root
USER node                                              # now non-root
```
If you create the dir after `USER node`, the node user can't chown it.

### Cleanup
```bash
docker volume rm demo-logs
```

---

## Layer ordering — good vs bad

### Bad pattern:
```dockerfile
COPY . .          # code + package.json together
RUN npm install   # re-runs even if only code changed!
```

### Good pattern:
```dockerfile
COPY package.json .   # dependencies spec (rarely changes)
RUN npm install       # cached until package.json changes
COPY . .              # code (changes often, but install is cached)
```
