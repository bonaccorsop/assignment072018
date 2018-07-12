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

    params = Object.assign({ fromCurrency: null, toCurrency: null, amount: null }, params);

    return Observable.of(params)

      .flatMap(params => Observable.if(
        () => params.fromCurrency && params.amount && params.toCurrency,
        Observable.of(params),
        Observable.throw(new InvalidParametersError('Invalid parameters'))
      ))

      // resolve exchangeRate by retriving targetRate and fromRate from ECB API's
      .flatMap(params => this.resolveRate$(params.toCurrency)
        .flatMap(targetRate => this.resolveRate$(params.fromCurrency).map(fromRate => fromRate / targetRate))
      )

      // calculate the result
      .map(exchangeRate => params.amount / exchangeRate )

      // data pack
      .map(result => ({
        input: { currency: params.fromCurrency, amount: params.amount},
        output: { currency: params.toCurrency, amount: result},
      }))

      // async write transaction in datastore
      .do(pack => this.transactionRepository.store$(pack).subscribe())
  }


  resolveRate$(currency) {

    if (currency == 'EUR') {
      return Observable.of(1)
    }

    return Observable.fromPromise(this.ecbClient.getEuroCurrencyRate(currency));
  }


}