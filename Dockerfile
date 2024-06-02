# we can't use alpine due to detection-issues with rollup
FROM node:latest as builder

WORKDIR /app
COPY package.json package-lock.json .
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:latest as runner

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf