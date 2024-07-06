FROM node:22

RUN apt-get -y update \
    && apt-get -y upgrade \
    && apt-get -y install yarn


WORKDIR /home/client
ADD . ./

RUN yarn install

CMD ["node", "main.js"]
