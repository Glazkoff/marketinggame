FROM node:14-alpine
WORKDIR /usr/src/app
COPY .env /usr/src/app/
COPY backend/package.json ./
RUN npm install --quiet && npm install node-pre-gyp -g && npm i -g nodemon
COPY backend/ .
# RUN npx sequelize-cli db:migrate
CMD [ "nodemon", "server.js" ]
EXPOSE 8005