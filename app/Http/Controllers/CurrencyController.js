'use strict';

const { Observable } = require('rx');
const BaseController = require('./BaseController');

module.exports = class CurrencyController extends BaseController {

  constructor(transactionService) {
    super();

    // Exchange method
    this.router.get('/v1/exchange/:fromCurrency/:value/:toCurrency?', (req, resp, next) => {
      transactionService.exchange$({
        fromCurrency: req.params.fromCurrency,
        value: req.params.value,
        toCurrency: req.params.toCurrency,
      })
      .subscribe(output => { resp.status(200).send(output) }, err => { next(err); });
    });

  }
}