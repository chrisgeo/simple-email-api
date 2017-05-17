FROM node:alpine

COPY . /app

RUN npm i

WORKDIR /app

EXPOSE 3000

CMD ["npm", "start"]
