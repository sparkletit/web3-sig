from node:16.16.0-alpine3.16
WORKDIR /usr/node/app/webpacket_site
RUN apk add zip
#RUN npm config set registry https://registry.npm.taobao.org
#RUN npm install n -g
#RUN n stable
RUN mkdir zipfiles
RUN npm install npm -g
RUN npm install pm2 -g
RUN echo 'alias ll="ls -l --color=auto"'>> ~/.bashrc