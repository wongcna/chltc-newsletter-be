#!/bin/bash
set -eu
OLD_VERSION=$(cat version)
VERSION=$(cat version | awk -F. '{print $1 "." $2 "." $3+1}')
[[ $VERSION != "" ]] || exit
echo -n $VERSION > version
echo "Bump version to $VERSION"
no_cache=${1:-}
NEW_VERSION=$VERSION  #$(cat version)
echo "Updating from $OLD_VERSION to $NEW_VERSION"

docker buildx build \
    --platform linux/amd64 \
    --tag "mydockerimagesreg.azurecr.io/chltc/chltc-newsletter-be:latest" \
    --file Dockerfile . \
    --push \
    ${no_cache}

echo "To execute the docker container, please run the following cmd"
echo "docker run -dit --name chltc-newsletter-be -p 3050:3050 --pull=always mydockerimagesreg.azurecr.io/chltc/chltc-newsletter-be:latest "

