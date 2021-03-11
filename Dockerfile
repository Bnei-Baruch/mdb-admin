ARG cdn_url="https://cdn.kabbalahmedia.info/"
ARG public_base="https://kabbalahmedia.info/"

FROM node:15 as build

LABEL maintainer="edoshor@gmail.com"

ARG cdn_url
ARG public_base

WORKDIR /app

ENV REACT_APP_ENV=external \
    REACT_APP_BASE_URL=${public_base}admin \
    REACT_APP_HISTORY_BASENAME=/admin/ \
    REACT_APP_AUTH_URL=https://accounts.kab.info/auth/realms/main \
    REACT_APP_MDB_URL=/mdb-api/ \
    REACT_APP_LINKER_URL=${cdn_url}

COPY . .

RUN yarn install --frozen-lockfile && \
    yarn build-css && \
    node_modules/.bin/react-app-rewired build && \
    rm -rf node_modules

FROM alpine
COPY --from=build /app/build /app
COPY misc/docker-entrypoint.sh .
ENTRYPOINT ["/docker-entrypoint.sh"]
