# 01 - Basics

The simplest Docker example: serve an HTML page with nginx.

## Build the image
```bash
docker build -t my-site .
```

## Run it
```bash
docker run --rm -p 8080:80 my-site
```
Open http://localhost:8080

## What's happening
1. `FROM nginx:alpine` — Start from an image that already has nginx installed
2. `COPY index.html ...` — Put our HTML file where nginx expects it
3. `docker run -p 8080:80` — Map port 80 inside the container to port 8080 on your machine

## Try it
- Edit `index.html`, rebuild, and re-run to see your changes
- Run `docker images` to see the image you created
- Run `docker ps` to see the running container

## Stop it
Press `Ctrl+C` or:
```bash
docker ps          # find the container ID
docker stop <id>
```
