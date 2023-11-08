echo ">>>>>> start deploy on server"

APP_NAME=creda
SUFFIX=.$(date '+%Y-%m-%d-%H-%M-%S')

cd ~/
tar zxvf ${APP_NAME}.tar.gz
sudo mv /var/www/html/${APP_NAME} /var/www/html/.bak/${APP_NAME}${SUFFIX}
sudo mv ~/build /var/www/html/${APP_NAME}

echo ">>>>>> end deploy on server"