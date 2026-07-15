FROM node:20-slim AS build
WORKDIR /app
COPY packages/mcp-server/package*.json ./
RUN npm install
COPY packages/mcp-server/ .
RUN npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
RUN npm install --omit=dev
ENTRYPOINT ["node", "dist/server.js"]
