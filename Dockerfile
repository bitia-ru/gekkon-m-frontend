FROM node:11-alpine AS builder

RUN npm config set unsafe-perm true

COPY . /app
WORKDIR /app

ARG apiUrl
ARG clientId
ARG sentryDsn
ENV API_URL ${apiUrl}
ENV CLIENT_ID ${clientId}
ENV SENTRY_DSN ${sentryDsn}

RUN npm i --production

RUN npm run build --production

FROM nginx:1.15-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist /app

COPY docker/configs/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
