echo ">>>>>> start deploy on server"

APP_NAME=creda
SUFFIX=.$(date '+%Y-%m-%d-%H-%M-%S')

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
DEPLOYMENT_PATH="/var/www/html/${FULL_APP_NAME}"

cd ~/
tar zxvf ${FULL_APP_NAME}.tar.gz
# Temporary backup, just in case
sudo mv /var/www/html/${FULL_APP_NAME} /var/www/html/.bak/${FULL_APP_NAME}${SUFFIX}
echo "Deploying code at ${DEPLOYMENT_PATH}"
sudo mv ~/build ${DEPLOYMENT_PATH}

echo "End of server side deployment"