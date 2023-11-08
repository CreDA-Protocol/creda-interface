#!/bin/bash
set -e # Stop on error

# Run with ./deployment/deploy.sh

APP_NAME=creda

# Build and copy to remote
npm run build
tar zcvf ${APP_NAME}.tar.gz build
scp ${APP_NAME}.tar.gz creda:~/

# Execute remote deployment
ssh root@creda 'bash -s' < deployment/deploy_on_server.sh

rm -f ${APP_NAME}.tar.gz

echo ">>>>>> all done"