FROM node:alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml .
RUN npm install

COPY . .
RUN npm run build

CMD HOST=0.0.0.0 PORT=3000 node -r dotenv/config build