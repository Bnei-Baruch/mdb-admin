ARG app_env="production"
ARG public_base="https://kabbalahmedia.info/"
ARG cdn_url="https://cdn.kabbalahmedia.info/"
ARG cdn_hls_url="https://cdn.kab.info/"
ARG auth_url="https://accounts.kab.info/auth/realms/main"

FROM node:21 as build

LABEL maintainer="edoshor@gmail.com"

ARG app_env
ARG public_base
ARG cdn_url
ARG cdn_hls_url
ARG auth_url

WORKDIR /app

ENV REACT_APP_ENV=${app_env} \
    REACT_APP_BASE_URL=${public_base}admin \
    REACT_APP_HISTORY_BASENAME=/admin/ \
    REACT_APP_AUTH_URL=${auth_url} \
    REACT_APP_MDB_URL=/mdb-api/ \
    REACT_APP_LINKER_URL=${cdn_url}\
    REACT_APP_LINKER_HLS_URL=${cdn_hls_url}

COPY . .

RUN yarn install --frozen-lockfile && \
    yarn build-css && \
    yarn react-scripts build && \
    rm -rf node_modules

FROM alpine
COPY --from=build /app/build /app
COPY misc/docker-entrypoint.sh .
ENTRYPOINT ["/docker-entrypoint.sh"]
