FROM node:18.17-alpine

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install && npm cache clean --force

COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "start:migrate:dev"]