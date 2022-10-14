FROM node:current-alpine3.15 as builder
RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm i --legacy-peer-deps
RUN npx nx run-many --target=build --all --skip-nx-cache

FROM pierrezemb/gostatic:latest as frontend
COPY --from=builder /app/dist/apps/frontend /srv/http
EXPOSE 8043
CMD [ "-fallback", "index.html" ]

FROM node:14-alpine as backend
ARG BACKEND_PORT
ENV PORT=$BACKEND_PORT
RUN mkdir /app
WORKDIR /app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/backend ./dist/apps/backend
COPY --from=builder /app/.env ./.env
EXPOSE $PORT
CMD [ "sh", "-c", "node ./dist/apps/backend/main.js"]