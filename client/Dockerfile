FROM node:20.12.1

RUN mkdir /app

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

EXPOSE 5173

RUN npm run build

CMD ["npm", "run", "dev"]