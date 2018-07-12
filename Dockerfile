# This is my custom nodejs boilerplate
# compiled with nodemon and pm2 (my favourite process manager tool)
FROM bonaccorsop/nodejs-boilerplate:lts

ARG buildenv="default"

# Copy source inside the image
COPY . /code

WORKDIR /code

# Install packages and dependencies
RUN if [ $buildenv != "local" ]; then set -x && npm install ; fi

# Launch tests
RUN npm run test

CMD ["npm", "start"]
