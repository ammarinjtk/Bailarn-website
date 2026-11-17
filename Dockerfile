# Stage 1: build the static export into out/
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve it with nginx on Cloud Run's port
FROM nginx:alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY headers.inc /etc/nginx/conf.d/headers.inc
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
