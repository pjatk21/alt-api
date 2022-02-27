FROM node:lts-alpine

RUN apk add git

RUN adduser -D -s /bin/bash altiapi

WORKDIR /app

COPY . /app

RUN chown -R altiapi /app

USER altiapi

RUN yarn install

RUN yarn build

WORKDIR /app/alt-api-ui

RUN yarn install

RUN yarn build

WORKDIR /app

EXPOSE 4000

ENTRYPOINT yarn start:prod
