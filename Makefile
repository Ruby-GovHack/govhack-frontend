CONTAINER_NAME_DEV=govhack-frontend-dev
IMAGE_NAME_DEV=${CONTAINER_NAME_DEV}-image

CONTAINER_NAME_PROD=govhack-frontend
IMAGE_NAME_PROD=${CONTAINER_NAME_PROD}-image

# The directory which contains this Makefile.
BUILD_DIR := $(shell dirname $(abspath $(lastword $(MAKEFILE_LIST))))

build-dev:
	docker build -t ${IMAGE_NAME_DEV} - < "${BUILD_DIR}/docker/dev/Dockerfile"

build-dev-nocache:
	docker build --no-cache -t ${IMAGE_NAME_DEV} - < "${BUILD_DIR}/docker/dev/Dockerfile"

run:
	docker run -i -t --rm --name="${CONTAINER_NAME_DEV}" --hostname="${CONTAINER_NAME_DEV}" -v "${BUILD_DIR}/code:/code" -p 9000:9000 -p 35729:35729 ${IMAGE_NAME_DEV}

rebuildandrun: build-dev run

build-prod:
	cp "${BUILD_DIR}/docker/prod/Dockerfile" "${BUILD_DIR}/Dockerfile"
	-docker build -t ${IMAGE_NAME_PROD} "${BUILD_DIR}"
	rm "${BUILD_DIR}/Dockerfile"

build-prod-nocache:
	cp "${BUILD_DIR}/docker/prod/Dockerfile" "${BUILD_DIR}/Dockerfile"
	docker build --no-cache -t ${IMAGE_NAME_PROD} "${BUILD_DIR}"
	rm "${BUILD_DIR}/Dockerfile"

serve:
	docker run -d --name="${CONTAINER_NAME_PROD}" --hostname="${CONTAINER_NAME_PROD}" -p 80:80 ${IMAGE_NAME_PROD}

stop:
	-docker stop ${CONTAINER_NAME_PROD}

rm: stop
	-docker rm ${CONTAINER_NAME_PROD}

rebuildandserve: build-prod stop rm serve
