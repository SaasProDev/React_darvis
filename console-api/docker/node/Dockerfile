FROM node:10


WORKDIR /app
# https://stackoverflow.com/a/32785014/232619
COPY . /app
RUN npm install

EXPOSE 8000

CMD ["npm", "start"]
