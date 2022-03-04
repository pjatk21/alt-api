FROM node:lts-alpine

RUN apk add git

RUN adduser -D -s /bin/bash altiapi

WORKDIR /app

COPY . /app

RUN chown -R altiapi /app

USER altiapi

RUN --mount=type=cache,target=/home/altiapi/.yarn YARN_CACHE_FOLDER=/home/altiapi/.yarn yarn install

RUN yarn build

WORKDIR /app/alt-api-ui

RUN --mount=type=cache,target=/home/altiapi/.yarn YARN_CACHE_FOLDER=/home/altiapi/.yarn yarn install

RUN yarn build

WORKDIR /app

EXPOSE 4000

ENV NODE_ENV=production \
    TZ=Europe/Warsaw

ENTRYPOINT yarn start:prod
