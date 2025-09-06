FROM oven/bun:latest

WORKDIR /var/www/html

COPY package.json package-lock.json ./
RUN bun install

COPY . .

RUN bun run build

EXPOSE 4000

ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=4000

CMD ["bun", "run", "dev"]
