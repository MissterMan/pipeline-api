# Build Stage
FROM node:lts-bullseye-slim AS build

WORKDIR /app
COPY package*.json .
COPY tsconfig.json .
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:lts-bullseye-slim AS production

WORKDIR /app
COPY package*.json .
RUN npm ci --only=production
COPY --from=build /app/dist/ ./dist
CMD ["node", "dist/server.js"]