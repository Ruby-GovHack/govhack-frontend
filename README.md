# Govhack Frontend

This project uses [Docker](https://www.docker.io/) to the minimise the need to install build dependencies onto the development machine.
This project is based on the [Yeoman](http://yeoman.io/) using the [AngularJS generator](https://github.com/yeoman/generator-angular).

The following references are useful:
* [How do I “think in AngularJS” if I have a jQuery background?](http://stackoverflow.com/a/15012542)
* [Yeoman Codelab](http://yeoman.io/codelab.html)
* [A Better Way to Learn AngularJS](http://www.thinkster.io/angularjs/GtaQ0oMGIl)

## Dev

### Build Docker Image

Builds a docker image based on Ubuntu 14.04 with dependencies needed for this project installed.

    sudo make build-dev

### Run Docker Image

This will start up a container and run an interactive bash shell.
When you exit bash the container will be automatically stopped and removed.

    sudo make run

Or to rebuild and then run:

    sudo make rebuildandrun

#### Exposed Ports

Port 9000 in the container is mapped to port 9000 on the host machine so you can browse the frontend on <http://localhost:9000/>.
Port 35729 is also mapped to the host machine to allow live-reloading to work.

#### Persistance

Changes made to the files in the `/code` directory will be reflected in the code directory outside the Docker container (and vice versa).
Any other changes made inside the Docker container however will be lost upon exiting the container.

#### Project Dependencies

To install dependencies run `npm install` followed by `bower install` (files will be installed to `/code/node_modules` and `/code/bower_components` respectively). 
This only needs to be done once as these file are not committed to git.

#### Build for Development

Use `grunt serve` to run the application on port 9000 while developing.
Grunt will watch files for changes and live-reload the page in your browser.

## Prod

### Build Docker Image

Builds a docker image based on Ubuntu 14.04 with dependencies needed for this project installed.
The project code is added to the docker image and is built using `grunt --force`.

    sudo make build-prod

### Run Docker Image

This will start up a container hosting the optimised versions of the project files on port 80 of the host machine.

    sudo make serve

Or to rebuild the container image and then serve (will stop already running container first if needed) use:

    sudo make rebuildandserve

### SSH

To SSH into the running container use.

    sudo make ssh

Note that the SSH keys included are obviously not secure. To generate new keys use:

    make sshkeygen



