FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN chown -R node:node /app

RUN mkdir -p /app/logs && chown node:node /app/logs

EXPOSE 3000

USER node

CMD ["sh", "-c", "node index.js && sleep infinity"]