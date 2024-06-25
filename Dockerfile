# Build Stage
FROM node:20.10.0-bullseye AS build

WORKDIR /app
COPY package*.json .
COPY tsconfig.json .
COPY .env.development .
RUN npm install
COPY . .
RUN npm run build

# Prod Stage
FROM node:20.10.0-bullseye AS production

WORKDIR /app
COPY package*.json .
COPY .env.production .
RUN npm ci --only=production
COPY --from=build /app/dist/ ./dist
CMD ["node", "dist/server.js"]