CONTAINER_NAME=govhack-frontend
IMAGE_NAME=${CONTAINER_NAME}-image

# The directory which contains this Makefile.
BUILD_DIR := $(shell dirname $(abspath $(lastword $(MAKEFILE_LIST))))

build:
	docker build -t ${IMAGE_NAME} .

run:
	docker run -i -t --rm --name="${CONTAINER_NAME}" --hostname="${CONTAINER_NAME}" -v "${BUILD_DIR}/code:/code" -p 9000:9000 -p 35729:35729 ${IMAGE_NAME}

rebuildandrun: build run
