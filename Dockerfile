FROM node

WORKDIR /var/www/html

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=4000

CMD ["npm", "run", "dev"]
