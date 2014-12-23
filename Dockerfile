FROM ubuntu:latest
MAINTAINER Tim Rodger

# Install dependencies
RUN apt-get update -qq && \
    apt-get -y install \
    nodejs \
    npm

EXPOSE 80

# set MONGO_HOST (ip address and port ) and MONGO_DB (db name) env vars before running this container
CMD ["nodejs", "/home/app/index.js"]

# Move files into place
COPY src/ /home/app/

# Install dependencies
WORKDIR /home/app

RUN npm install
