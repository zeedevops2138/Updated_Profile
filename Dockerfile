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

# TEMP: Install AWS CLI for debugging (can be removed later)
RUN apt-get update && apt-get install -y curl unzip python3 python3-pip && \
    pip3 install awscli && \
    apt-get clean

RUN groupadd -r appuser && useradd -r -g appuser -d /app appuser

WORKDIR /app

COPY --from=build /app /app

RUN mkdir -p /app/uploads && chown -R appuser:appuser /app/uploads

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
