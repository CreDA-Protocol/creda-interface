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

cd ~/
tar zxvf ${APP_NAME}.tar.gz
FULL_APP_NAME=${APP_NAME}-${TARGET}
sudo mv /var/www/html/${FULL_APP_NAME} /var/www/html/.bak/${FULL_APP_NAME}${SUFFIX}
sudo mv ~/build /var/www/html/${FULL_APP_NAME}

echo "End of server side deployment"