from webdevops/php-nginx:7.4
WORKDIR /var/www/html

RUN apt-get update && apt-get install -y docker-ce-cli
RUN groupadd -g 999 docker
RUN usermod -aG docker www-data

RUN echo 'alias ll="ls -l --color=auto"'>> ~/.bashrc
USER www-data
