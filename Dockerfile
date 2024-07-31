FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . . 


RUN npx prisma generate
CMD [ "npm", "start" ]