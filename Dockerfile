FROM node:lts

RUN adduser --disabled-login --shell /bin/bash altiapi

WORKDIR /app

COPY . /app

RUN chown -R altiapi /app

USER altiapi

RUN yarn install

RUN yarn build

# Reduce size of node_modules folder
RUN yarn install --production

EXPOSE 3000

ENTRYPOINT yarn start:prod
