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