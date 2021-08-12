FROM node:14

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8005 
CMD [ "npm", "run", "watch" ]
