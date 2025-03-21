FROM node:18 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json ./


# Install app dependencies
RUN yarn

COPY . .

RUN yarn build

FROM node:18

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD [ "yarn", "start" ]