'use strict';

const { env, logger } = require('../dependencies.js');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

if (env.get('HTTP_DEBUGMODE', false)) {
  logger.info('MorganBody Debug enabled');

  const morgan = require('morgan');
  app.use(morgan(':date[iso] :req[x-user] :method :url :status - :response-time ms'));

  const morganBody = require('morgan-body');
  morganBody(app);
}


// Base routes
app.get('/', (req, resp) => resp.send(`<h3>Ok, It\'s working! :)</h3>`));
app.get('/healthcheck', (req, resp) => { resp.status(204).send() });

// Controllers
const services = require('../services.js');

// Login Controller
const CurrencyController = require('./Controllers/CurrencyController');
app.use('/currency', (new CurrencyController(services.currency)).getRouter());



// Error handlers
const { Error } = require('mongoose');
const ServiceError = require('../Errors/ServiceError');
const EntityNotFoundError = require('../Errors/EntityNotFoundError');
const InputDataError = require('../Errors/InputDataError');
const ForbiddenResourceError = require('../Errors/ForbiddenResourceError');
const GenericUserError = require('../Errors/GenericUserError');

app.use((err, req, resp, next) => {
  let payload = {};

  if (err instanceof GenericUserError) {
    payload = { code: 400, msg: err.message };
  } else if (err instanceof ForbiddenResourceError) {
    payload = { code: 403, msg: err.message };
  } else if (err instanceof EntityNotFoundError) {
    payload = { code: 404, msg: err.message ? err.message : "Entity not found" };
  } else if (err instanceof InputDataError) {
    payload = { code: 400, msg: "Missing fields: " + err.message };
  } else if (err instanceof Error.ValidationError) {
    payload = { code: 400, msg: err.message };
  }

  else if (err instanceof ServiceError && err.code) {
    payload = { code: err.code, msg: err.message };
  } else {
    next(err);
    return;
  }
  resp.status(payload.code).send(payload);
});

const http = require('http');
module.exports = {
  listen: (port) => new Promise((resolve, reject) => {
    http.createServer(app).listen(port, err => {
      err ? reject(err) : resolve(app);
    });
  })
}