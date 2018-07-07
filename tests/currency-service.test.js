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

test('should throw exception if fromCurrency or value is not fill', done => {

  const currencyService = new CurrencyService({}, {}, mockedTransactionRepository);

  currencyService.exchange$({ value: 12.3, toCurrency: 'EUR' })
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



test('should call the ECB Client with choosen currency', done => {

  const mockedEcbClient = { getEuroCurrencyRate: jest.fn(currency => Promise.resolve(0)) };
  const currencyService = new CurrencyService({}, mockedEcbClient, mockedTransactionRepository);

  currencyService.exchange$({ fromCurrency: 'USD', value: 12.3, toCurrency: 'EUR' })
    .toPromise()
    .then(e => {
      expect(mockedEcbClient.getEuroCurrencyRate).toHaveBeenCalledWith('USD');
      done();
    });
});


test('should exchange currency with right output values', done => {

  let currencyService = new CurrencyService({}, { getEuroCurrencyRate: jest.fn(currency => Promise.resolve(1.1724)) }, mockedTransactionRepository);
  currencyService.exchange$({ fromCurrency: 'USD', value: 12.32, toCurrency: 'EUR' })
    .toPromise()
    .then(out => {
      expect(out).toBeCloseTo(10.51);
      done();
    });

    currencyService = new CurrencyService({}, { getEuroCurrencyRate: jest.fn(currency => Promise.resolve(129.65)) }, mockedTransactionRepository);
    currencyService.exchange$({ fromCurrency: 'JPY', value: 13.02, toCurrency: 'EUR' })
      .toPromise()
      .then(out => {
        expect(out).toBeCloseTo(0.10);
        done();
      });

      currencyService = new CurrencyService({}, { getEuroCurrencyRate: jest.fn(currency => Promise.resolve(129.65)) }, mockedTransactionRepository);
      currencyService.exchange$({ fromCurrency: 'JPY', value: 13.02, toCurrency: 'EUR' })
        .toPromise()
        .then(out => {
          expect(out).not.toBeCloseTo(0.14);
          done();
        });



});