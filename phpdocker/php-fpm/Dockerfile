FROM phpdockerio/php72-fpm:latest
WORKDIR "/application"

# Fix debconf warnings upon build
ARG DEBIAN_FRONTEND=noninteractive


# Install git
RUN apt-get update \
    && apt-get -y install git \
    && apt-get clean; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*