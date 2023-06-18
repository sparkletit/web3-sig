from node:16.16.0-alpine3.16
WORKDIR /usr/node/app

RUN npm config set registry https://registry.npm.taobao.org
#RUN npm install n -g
#RUN n stable
RUN mkdir web
RUN npm install npm -g
RUN echo 'alias ll="ls -l --color=auto"'>> ~/.bashrc