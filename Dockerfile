FROM node:14-alpine
WORKDIR /api
COPY package*.json /api/
RUN npm install
COPY . /api
EXPOSE 3000
CMD ["npm", "run", "start"]




