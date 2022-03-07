FROM node:lts-alpine

# Prepare the environment

RUN apk add git

RUN adduser -D -s /bin/bash altiapi

WORKDIR /app

RUN mkdir /app/alt-api-ui

RUN chown -R altiapi /app

USER altiapi

# Copy dependencies defined in package.json

COPY package.json /app/package.json

COPY yarn.lock /app/yarn.lock

COPY alt-api-ui/package.json /app/alt-api-ui/package.json

COPY alt-api-ui/yarn.lock /app/alt-api-ui/yarn.lock

# Install dependencies

# Install api dependencies
RUN yarn install

# Install ui dependencies
WORKDIR /app/alt-api-ui
RUN yarn install

# Build api

WORKDIR /app
RUN yarn build

WORKDIR /app/alt-api-ui
RUN yarn build

# Prepare api
WORKDIR /app
EXPOSE 4000

ENV NODE_ENV=production \
    TZ=Europe/Warsaw

ENTRYPOINT yarn start:prod
