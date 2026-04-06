# ── Stage 1: Build ───────────────────────────────────────────────────
# NODE_OPTIONS=--openssl-legacy-provider required because react-scripts@3.2.0
# uses webpack 4 which relies on MD4 hashing — not supported in OpenSSL 3 (Node 17+)
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Copy built static files
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run requires port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
