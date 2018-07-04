'use strict';

const env = require('./envparser');

const winston = require('winston');
const moment = require('moment');
const winstonConfig = winston.config;
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function () { return moment().toISOString() },
      formatter: function (options) {
        return options.timestamp() + ' ' +
          winstonConfig.colorize(options.level, options.level.toUpperCase()) + ' ' +
          (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
      }
    })
  ]
});
logger.level = 'debug';


const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const SchemaLoader = require('./SchemaLoader');
const schemas = new SchemaLoader(mongoose);

const ECBCurrencyClient = require('./Clients/ECBCurrencyClient');
const ecbClient = new ECBCurrencyClient(logger);

module.exports = {
  env,
  mongoose,
  schemas,
  logger,
  clients: { ecbClient }
};
