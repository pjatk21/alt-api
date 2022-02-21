FROM node:lts-alpine

RUN apk add git

RUN adduser -D -s /bin/bash altiapi

WORKDIR /app

COPY . /app

RUN chown -R altiapi /app

USER altiapi

RUN yarn install

RUN yarn build

EXPOSE 3000

ENTRYPOINT node dist/main.js
