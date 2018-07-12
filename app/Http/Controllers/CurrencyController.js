'use strict';

const { Observable } = require('rx');
const BaseController = require('./BaseController');

module.exports = class CurrencyController extends BaseController {

  constructor(transactionService) {
    super();

    // Exchange method
    this.router.get('/v1/exchange/:amount/:fromCurrency/:toCurrency', (req, resp, next) => {
      transactionService.exchange$({
        fromCurrency: req.params.fromCurrency,
        toCurrency: req.params.toCurrency,
        amount: parseFloat(req.params.amount),
      })
      .subscribe(payload => { resp.status(200).send(payload) }, err => { next(err); });
    });

  }
}