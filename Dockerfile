FROM kyma/docker-nginx
MAINTAINER Cassidy Bridges <cassidybridges@gmail.com>

ADD ./www/ /var/www
ADD ./config /var/www/config
ADD ./lib /var/www/lib
CMD 'nginx'
