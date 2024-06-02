FROM node:alpine as builder

WORKDIR /app
COPY package.json package-lock.json .
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:latest as runner

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf