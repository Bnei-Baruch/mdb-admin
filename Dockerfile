FROM node:13 as build

LABEL maintainer="edoshor@gmail.com"

WORKDIR /app

ENV DEPLOY_ENV=external \
    REACT_APP_BASE_URL=https://kabbalahmedia.info/admin \
    REACT_APP_HISTORY_BASENAME=/admin/ \
    REACT_APP_AUTH_URL=https://accounts.kbb1.com/auth/realms/main \
    REACT_APP_MDB_URL=/mdb-api/ \
    REACT_APP_LINKER_URL=https://cdn.kabbalahmedia.info/

COPY . .

RUN yarn install --frozen-lockfile && \
    yarn build:$DEPLOY_ENV && \
    rm -rf node_modules

FROM alpine
COPY --from=build /app/build /app
