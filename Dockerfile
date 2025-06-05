# we can't use alpine due to detection-issues with rollup
FROM node:latest AS builder

# define build-args for environment-variables
ARG VITE_BACKEND_URL

# set environment-variables during build-process
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:latest AS runner

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf