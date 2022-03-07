FROM node:lts-alpine

# Prepare the environment

RUN apk add git

RUN adduser -D -s /bin/bash altiapi

WORKDIR /app

RUN mkdir /app/alt-api-ui

RUN chown -R altiapi /app

USER altiapi

# Copy dependencies defined in package.json

COPY --chown=altiapi package.json /app/package.json

COPY --chown=altiapi yarn.lock /app/yarn.lock

COPY --chown=altiapi alt-api-ui/package.json /app/alt-api-ui/package.json

COPY --chown=altiapi alt-api-ui/yarn.lock /app/alt-api-ui/yarn.lock

# Install dependencies

# Install api dependencies
RUN yarn install

# Install ui dependencies
WORKDIR /app/alt-api-ui
RUN yarn install

# Copy rest of the sources

COPY --chown=altiapi . /app

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
