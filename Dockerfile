##############################
# Stage 1: Build Dependencies
##############################
FROM node:20-slim AS build

WORKDIR /app

COPY app/package*.json ./

RUN npm install --omit=dev

COPY app ./

##############################
# Stage 2: Runtime Container
##############################
FROM node:20-slim

RUN groupadd -r appuser && useradd -r -g appuser -d /app appuser

WORKDIR /app

COPY --from=build /app /app

RUN mkdir -p /app/uploads && chown -R appuser:appuser /app/uploads

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
