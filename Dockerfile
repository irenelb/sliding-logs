# Install production dependencies
FROM node:16 as depsStage
WORKDIR /app
COPY package*.json ./
RUN npm ci --prod

# Run tests & build
FROM node:16 as buildStage
WORKDIR /app
COPY . .
RUN npm ci \
  && npm run build \
  && npm run test


# Stage: image create final image
FROM node:16-alpine
# Create app directory
WORKDIR /app
COPY --chown=node:node --from=buildStage /app/build ./build
# Bundle app source
COPY --chown=node:node --from=depsStage /app/node_modules ./node_modules
COPY --chown=node:node ./package*.json ./
RUN apk --no-cache add curl
USER node
EXPOSE 3000
ENTRYPOINT [ "node", "build/src/index.js" ]

