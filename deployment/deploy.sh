#!/bin/bash
set -e # Stop on error

# Run with ./deployment/deploy.sh

APP_NAME=creda

# Build and copy to remote
# TEMP npm run build
tar zcvf ${APP_NAME}.tar.gz build
scp ${APP_NAME}.tar.gz credafront:~/

# Execute remote deployment
ssh root@credafront 'bash -s' < deployment/deploy_to_server.sh

rm -f ${APP_NAME}.tar.gz

echo ">>>>>> all done"