FROM node:alpine

EXPOSE 3000

WORKDIR /opt/app

RUN apk add --no-cache git

ADD . /opt/app

RUN npm install

CMD npm start