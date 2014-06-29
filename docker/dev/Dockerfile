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

# Clean up some uneeded files.
RUN DEBIAN_FRONTEND=noninteractive apt-get clean
RUN rm -rf /var/lib/apt/lists/*
RUN rm -rf /var/tmp/*
RUN rm -rf /tmp/*

# cd into /code on login by docker
RUN echo "cd /code" >> /home/docker/.bashrc

# Code volume should be mounted here.
VOLUME /code

# Main exposed port
EXPOSE 9000
# Live reload
EXPOSE 35729

# Use baseimage-docker's init system so CMD doesn't have PID 1.
# https://github.com/phusion/baseimage-docker#running-a-one-shot-command-in-the-container
ENTRYPOINT ["/sbin/my_init", "--quiet", "--skip-startup-files", "--"]

# Open shell as user docker by defualt.
CMD ["su", "--login", "docker"]
