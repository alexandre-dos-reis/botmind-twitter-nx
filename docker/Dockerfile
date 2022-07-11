FROM node:16 as builder
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline
RUN pnpm exec nx run-many --target=build --all --skip-nx-cache
#RUN rm -Rf node_modules && pnpm install --prod -r --offline

FROM pierrezemb/gostatic:latest as frontend
COPY --from=builder /app/dist/apps/frontend /srv/http
EXPOSE 8043
CMD ["goStatic"]

FROM node:16-alpine as backend
ARG BACKEND_PORT
ENV PORT=$BACKEND_PORT
WORKDIR /app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/backend ./dist/apps/backend
COPY --from=builder /app/.env ./.env
EXPOSE $PORT
CMD [ "sh", "-c", "node ./dist/apps/backend/main.js"]