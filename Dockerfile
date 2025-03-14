FROM node:23

WORKDIR /var/www/html

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

CMD ["npm", "run", "dev"]
