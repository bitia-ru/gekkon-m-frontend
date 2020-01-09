FROM node:11-alpine AS builder

RUN npm config set unsafe-perm true

COPY . /app
WORKDIR /app

RUN npm i --production
RUN npm i favicons-webpack-plugin@1.0.2

ARG apiUrl
ARG clientId
ARG sentryDsn
ENV API_URL ${apiUrl}
ENV CLIENT_ID ${clientId}
ENV SENTRY_DSN ${sentryDsn}

RUN npm run build --development

FROM nginx:1.15-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist /app

# TODO: GKN-113: Remove this after refactoring:
RUN mkdir public
COPY public/img ./public/img
COPY public/fonts ./public/fonts

COPY docker/configs/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
