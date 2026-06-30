FROM node:18-bullseye

RUN apt-get update && apt-get install -y netcat-traditional postgresql-client dos2unix

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

COPY docker/entrypoint.sh /app/docker/entrypoint.sh

RUN dos2unix /app/docker/entrypoint.sh /app/docker/db-url.sh \
	&& chmod +x /app/docker/entrypoint.sh

RUN npm run build

ENTRYPOINT ["docker/entrypoint.sh"]

EXPOSE 8081
CMD ["npm", "run", "start"]
