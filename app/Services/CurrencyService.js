'use strict';

const { Observable } = require('rx');

const BaseService = require('./BaseService');

module.exports = class CurrencyService extends BaseService
{
  constructor(options, ecbClient, transactionRepository) {
    super(options);
    this.ecbClient = ecbClient;
    this.transactionRepository = transactionRepository;
  }


}