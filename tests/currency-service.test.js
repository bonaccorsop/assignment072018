'use strict';

const { Observable } = require('rx');

// ------------------
// Mocking dependencies
// ------------------

const mockedTransactionRepository = { store$: jest.fn(data => Observable.of(data)) };


const CurrencyService = require('../app/Services/CurrencyService');
const InvalidParametersError = require('../app/Errors/InvalidParametersError');

// ------------------
// Tests
// ------------------

test('should throw exception if fromCurrency or amount is not fill', done => {

  const currencyService = new CurrencyService({}, {}, mockedTransactionRepository);

  currencyService.exchange$({ amount: 12.3, toCurrency: 'EUR' })
    .toPromise()
    .catch(e => {
      expect(e instanceof InvalidParametersError).toBeTruthy();
      done();
    });

    currencyService.exchange$({ fromCurrency: 'YEN', toCurrency: 'EUR' })
    .toPromise()
    .catch(e => {
      expect(e instanceof InvalidParametersError).toBeTruthy();
      done();
    });

});



test('should call the ECB Client ONCE with choosen currency', done => {

  let mockedEcbClient = { getEuroCurrencyRate: jest.fn(currency => Promise.resolve(0)) };
  const currencyService = new CurrencyService({}, mockedEcbClient, mockedTransactionRepository);

  currencyService.exchange$({ fromCurrency: 'USD', amount: 12.3, toCurrency: 'EUR' })
    .toPromise()
    .then(e => {
      // expecting that is called once with value USD (EURO must be skipped)
      expect(mockedEcbClient.getEuroCurrencyRate.mock.calls.length).toBe(1);
      expect(mockedEcbClient.getEuroCurrencyRate.mock.calls[0][0]).toBe('USD');
      done();
    });
});


test('should call the ECB Client TWICE with choosen currency', done => {

  const mockedEcbClient = { getEuroCurrencyRate: jest.fn(currency => Promise.resolve(0)) };
  const currencyService = new CurrencyService({}, mockedEcbClient, mockedTransactionRepository);

  currencyService.exchange$({ fromCurrency: 'USD', amount: 12.3, toCurrency: 'JPY' })
    .toPromise()
    .then(e => {
      // expecting that is called twice
      expect(mockedEcbClient.getEuroCurrencyRate.mock.calls.length).toBe(2);
      expect(mockedEcbClient.getEuroCurrencyRate.mock.calls[0][0]).toBe('JPY');
      expect(mockedEcbClient.getEuroCurrencyRate.mock.calls[1][0]).toBe('USD');
      done();
    });
});


