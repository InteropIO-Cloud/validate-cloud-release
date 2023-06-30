FROM --platform=linux/amd64 node:18-alpine

WORKDIR /home/node/app

COPY ./package*.json /home/node/app/

RUN npm install

COPY ./src/ /home/node/app/src

CMD [ "node", "/home/node/app/src/index.js" ]
