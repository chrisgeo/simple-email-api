FROM node:alpine

COPY . /app

RUN npm i

WORKDIR /app

CMD ["npm", "start"]
