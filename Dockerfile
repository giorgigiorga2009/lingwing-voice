FROM node:18-alpine AS BUILD_IMAGE
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --production --force
COPY . /app/
RUN yarn build
FROM node:18-alpine AS PRODUCTION_STAGE
WORKDIR /app
COPY --from=BUILD_IMAGE /app/ ./
EXPOSE 3000
CMD ["npm", "start"]
