---
title: WordPress Caddy & Docker
date: 2022-02-10T09:25:00.698Z
tags: docker, caddy, wordpress, short
draft: false
---

Project structure

```
├── Caddyfile
├── caddy_config/
├── caddy_data/
├── db/
├── docker-compose.yml
├── php.ini
└── src/
```

docker-compose.yml

```yml
version: '3'
services:
  wordpress:
    image: wordpress:php7.4-fpm
    restart: always
    networks:
      - wordpress
    depends_on:
      - database
    environment:
      WORDPRESS_DB_HOST: database
      WORDPRESS_DB_USER: ${DB_USER}
      WORDPRESS_DB_PASSWORD: ${DB_PASSWORD}
      WORDPRESS_DB_NAME: ${DB_NAME}
    volumes:
      - ./src:/var/www/html
      - ./php.ini:/usr/local/etc/php/conf.d/custom.ini
  database:
    image: mariadb:10.4
    restart: always
    networks:
      - wordpress
    environment:
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - ./db:/var/lib/mysql
  caddy:
    image: caddy:alpine
    ports:
      - 80:80
      - 443:443
    networks:
      - wordpress
    volumes:
      - ./src:/var/www/html
      - ./caddy_data:/data
      - ./caddy_config:/config
      - ./Caddyfile:/etc/caddy/Caddyfile
    restart: unless-stopped
networks:
  wordpress: {}
```

Caddyfile

```
{
	email email@example.com
}

your-site.com {
	root * /var/www/html
	php_fastcgi wordpress:9000
	file_server
}


www.your-site.com {
	redir https://your-side.com{uri}
}
```