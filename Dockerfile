# DOCKER-VERSION 0.10.0

FROM ubuntu:14.04

# make sure apt is up to date
RUN apt-get update

# install nodejs and npm
RUN apt-get install -y nodejs npm nodejs-legacy git git-core

ADD start.sh /tmp/

RUN chmod +x /tmp/start.sh

WORKDIR /tmp
RUN git clone https://github.com/OAGr/fermi-backend.git
WORKDIR /tmp/fermi-backend
RUN npm install

CMD npm start
