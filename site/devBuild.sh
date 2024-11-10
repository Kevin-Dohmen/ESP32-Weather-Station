#!/bin/bash

# Define the host directory and the container directory
HOST_DIR="$(pwd)/Web"
CONTAINER_DIR="/usr/share/nginx/html"

# Run the Docker container with the volume mapping
docker run -d -p 80:80 -v "$HOST_DIR":"$CONTAINER_DIR" nginx:latest