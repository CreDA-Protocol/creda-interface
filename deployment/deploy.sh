#!/bin/bash
set -e # Stop on error

# Run with ./deployment/deploy.sh

APP_NAME=creda

# Check if target argument is provided
if [ -z "$1" ]; then
  echo "Please provide a target argument. Usage: ./deployment/deploy.sh [target]"
  exit 1
fi

TARGET=$1

# Check if target argument is valid
VALID_TARGETS=("staging" "prod")
if [[ ! " ${VALID_TARGETS[@]} " =~ " ${TARGET} " ]]; then
  echo "Invalid target argument. Accepted values: staging, prod"
  exit 1
fi

# Build and copy to remote
echo "Building app"
npm run build
echo "Creating deployment archive file"
tar zcvf ${APP_NAME}.tar.gz build
echo "Uploading html/js archive to server"
scp ${APP_NAME}.tar.gz credafront:~/

# Execute remote deployment
echo "Executing deployment to server"
ssh root@credafront "bash -s ${TARGET}" < deployment/deploy_to_server.sh

rm -f ${APP_NAME}.tar.gz

echo "Deployment complete"
echo "Server source code is at: /var/www/html/"
echo "Server nginx config is at: /etc/nginx/conf.d/creda-interface.conf"