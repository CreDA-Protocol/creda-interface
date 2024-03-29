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

FULL_APP_NAME=${APP_NAME}-${TARGET}

# Build the right target
echo "Building ${TARGET}"
case $TARGET in
  staging)
    npm run build:staging
    ;;
  prod)
    npm run build:prod
    ;;
esac

echo "Creating deployment archive file"
tar zcvf ${FULL_APP_NAME}.tar.gz build

echo "Uploading html/js archive to server"
scp ${FULL_APP_NAME}.tar.gz credafront:~/

# Execute remote deployment
echo "Executing deployment to server"
ssh root@credafront "bash -s ${TARGET}" < deployment/deploy_to_server.sh

rm -f ${FULL_APP_NAME}.tar.gz

echo "Deployment complete"
echo "Server source code is at: /var/www/html/"
echo "Server nginx config is at: /etc/nginx/conf.d/creda-interface-${TARGET}.conf"