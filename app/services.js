'use strict';

const { logger, clients } = require('./dependencies');
const repos = require('./repositories');

const CurrencyService = require('./Services/CurrencyService');
const currency = new CurrencyService({ logger }, clients.ecbClient, repos.transaction);

module.exports = { currency };
