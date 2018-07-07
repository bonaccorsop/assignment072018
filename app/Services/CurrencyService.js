'use strict';

const { Observable } = require('rx');

const BaseService = require('./BaseService');

const InvalidParametersError = require('../Errors/InvalidParametersError');

module.exports = class CurrencyService extends BaseService
{
  constructor(options, ecbClient, transactionRepository) {
  super(options);
  this.ecbClient = ecbClient;
  this.transactionRepository = transactionRepository;
  }

  exchange$(params) {

    params = Object.assign({
      fromCurrency: null,
      toCurrency: 'EUR',
      value: null,
    }, params);

    return Observable.of(params)

      .flatMap(params => Observable.if(
        () => params.fromCurrency && params.value,
        Observable.of(params),
        Observable.throw(new InvalidParametersError('Invalid parameters'))
      ))

      // get conversion rate form ECB WebAPI
      .flatMap(params => Observable.fromPromise(this.ecbClient.getEuroCurrencyRate(params.fromCurrency)))
      .map(rate => params.value / rate)

      // write transaction in datastore
      .flatMap(out => this.transactionRepository.store$({
        input: { currency: params.fromCurrency, value: params.value},
        output: { currency: params.toCurrency, value: out},
      }))

  }


}