# CreDA Web Client App

- Deployed url: https://creda.app/

## Development

### Initial setup

- `npm i -D`
- Start a local portfolio service from https://github.com/CreDA-Protocol/creda-portfolio-api and configure your .env, or directly use https://portfolio-api.creda.app
- Clone .env.sample into .env and edit it if needed (default config should be fine for dev).

### Run for development

- `npm run start`

### Build for production

- `npm run build-all`
- A creda.zip file is created with the static prod content to deploy.

### Test production build locally before deployment

- `npm install -g serve`
- `serve -s build`

### Deployment steps

See [creda-home](https://github.com/CreDA-Protocol/creda-home) repo for more details about servers/infrastructure.

Note: no need to build, the deployment script does the prod build

- Make sure to deploy the [CreDA portfolio api](https://github.com/CreDA-Protocol/creda-portfolio-api) first.
- Configure your local ~/.ssh/config with a host named "credafront" with an authorized public key to the server
- `deployment/deploy.sh`

**Verify deployment status**

- ssh root@credafront
- tail -f /var/log/nginx/access.log