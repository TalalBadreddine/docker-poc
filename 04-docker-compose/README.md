# 03 - Docker Compose (Frontend + Backend + DB)

A full-stack todo app with three services wired together.

## Architecture
```
Browser → :8080 (nginx/frontend)
                → :3001 (express/backend)
                        → :5432 (postgres/db)
```

## Run it
```bash
docker compose up --build
```

Then open http://localhost:8080

## What docker-compose does
- **Builds** the frontend and backend images from their Dockerfiles
- **Pulls** the postgres image from Docker Hub
- **Creates a network** so all 3 services can talk to each other by name
- **Creates a volume** (pgdata) to persist the database

## Key concepts

### Service networking
Services talk to each other using their **service name** as hostname:
```yaml
DB_HOST: db    # "db" resolves to the postgres container's IP
```
No need for localhost or IP addresses — Docker DNS handles it.

### depends_on
```yaml
backend:
  depends_on:
    - db
```
Starts `db` before `backend`. Note: it waits for the container to start,
not for postgres to be ready. For production, use healthchecks.

### Volumes
```yaml
volumes:
  pgdata:     # named volume, persists across docker compose down/up
```
Your todos survive restarts. To wipe the DB:
```bash
docker compose down -v    # -v removes volumes
```

### Ports
```yaml
ports:
  - "3001:3000"   # host:container
```
Container runs on 3000 internally, exposed as 3001 on your machine.

## Useful commands
```bash
docker compose up --build       # start everything (rebuild images)
docker compose up -d            # start in background (detached)
docker compose ps               # see running services
docker compose logs backend     # logs for one service
docker compose down             # stop and remove containers
docker compose down -v          # stop + remove volumes (wipes DB)
```
