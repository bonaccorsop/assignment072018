'use strict';

const { clients, logger } = require('./app/dependencies');

clients.ecbClient.getEuroCurrencyRate('USD')
    .then(resp => logger.debug(resp))