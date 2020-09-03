FROM node:12.13.1-alpine3.9

WORKDIR /app

RUN apk update && \
    apk add git && \
    apk add --no-cache make gcc g++ python && \
    npm config set unsafe-perm true && \
    npm install -g npm && \
    npm install -g vue-cli

ENV HOST 0.0.0.0
EXPOSE 8080
