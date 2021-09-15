# --- START: builder stage ---
FROM node:14 as base
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn --prod --ignore-optional


# --- START: dev stage ---
FROM node:14-slim as dev
WORKDIR /app
ARG PORT=3100

COPY src /app/src
COPY nodemon.json .
COPY --from=base /app/node_modules /app/node_modules

RUN yarn global add nodemon

EXPOSE $PORT
ENTRYPOINT ["nodemon", "--config", "nodemon.json", "src/index.js"]
CMD ["nodemon", "--config", "nodemon.json", "src/index.js"]


# --- START: release stage ---
FROM node:14-alpine AS release
WORKDIR /app
ARG PORT=3100

COPY src /app/src
COPY --from=base /app/node_modules /app/node_modules

USER node
EXPOSE $PORT
ENTRYPOINT ["node", "src/index.js"]
CMD ["node", "src/index.js"]
