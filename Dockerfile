# Dockerfile

FROM node:alpine

RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["HOST=127.0.0.1", "PORT=3000", "node", "-r", "dotenv/config", "build"]