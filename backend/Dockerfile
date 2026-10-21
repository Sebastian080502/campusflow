FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM deps AS build
COPY tsconfig.json tsconfig.build.json nest-cli.json vitest.config.ts ./
COPY src ./src
COPY test ./test
ENV DATABASE_URL=postgresql://campusflow:build-only@127.0.0.1:5432/campusflow
RUN npx prisma generate && npm run build

FROM build AS test
RUN npm test

FROM node:22-alpine AS prod
WORKDIR /app
RUN apk add --no-cache openssl wget
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev
ENV DATABASE_URL=postgresql://campusflow:build-only@127.0.0.1:5432/campusflow
RUN npx prisma generate
ENV DATABASE_URL=
ARG APP_VERSION=dev
ENV APP_VERSION=${APP_VERSION}
ENV NODE_ENV=production
COPY --from=test /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --retries=5 CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "dist/main.js"]
