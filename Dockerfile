FROM node:12-alpine
WORKDIR /usr/src/app
COPY ./server/ ./
RUN npm ci --only=production
CMD [ "node", "main.js" ]