FROM node:10-alpine
WORKDIR /code
RUN mkdir -p /code/node_modules && chown -R node:node /code
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 4000
CMD [ "node", "app.js" ]
