# https://github.com/phusion/baseimage-docker
FROM phusion/baseimage:0.9.10

# Create user docker so we don't have to run everything as root.
RUN useradd -d /home/docker -m -s /bin/bash docker

# Install dependencies.
RUN DEBIAN_FRONTEND=noninteractive apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y build-essential
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs-legacy npm git
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y ruby-compass
# These are needed by phantomjs, a dependency of generator-angular.
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y chrpath git-core libssl-dev libfontconfig1-dev
RUN npm install --global yo generator-angular

# Install SSH key.
ADD ./docker/prod/govhack-frontend.key.pub /tmp/govhack-frontend.key.pub
RUN cat /tmp/govhack-frontend.key.pub
RUN cat /tmp/govhack-frontend.key.pub >> /root/.ssh/authorized_keys

# Add the code directory to the container image.
ADD ./code /code
RUN chown -R docker /code

RUN su -l docker -c "cd /code; npm install"
RUN su -l docker -c "cd /code; bower install"
RUN su -l docker -c "cd /code; grunt --force"

# Clean up some uneeded files.
RUN DEBIAN_FRONTEND=noninteractive apt-get clean
RUN rm -rf /var/lib/apt/lists/*
RUN rm -rf /var/tmp/*
RUN rm -rf /tmp/*

# Run govhack-frontend on container start.
ADD ./docker/prod/run-govhack-frontend.sh  /etc/service/govhack-frontend/run

# Main exposed port
EXPOSE 9000

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]
