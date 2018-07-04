'use strict';

const schemas = require('./dependencies').schemas;

const TransactionRepository = require('./Repositories/TransactionRepository');
const transaction = new TransactionRepository(schemas);

module.exports = { transaction };

