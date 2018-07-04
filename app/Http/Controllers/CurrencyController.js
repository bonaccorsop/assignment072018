'use strict';

const { Observable } = require('rx');
const BaseController = require('./BaseController');

module.exports = class CurrencyController extends BaseController {

  constructor(transactionService) {
  super();

  // List users
  this.router.post('/v1/exchange', (req, resp, next) => {
    transactionService.exchange$(req.body)
    .subscribe(token => { resp.status(201).send(token) }, err => { next(err); });
  });

  }
}