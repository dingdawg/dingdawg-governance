FROM node:20-alpine AS build
WORKDIR /app
COPY packages/mcp-server/package*.json ./
RUN npm install
COPY packages/mcp-server/ .
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
RUN npm install --omit=dev
ENTRYPOINT ["node", "dist/server.js"]
