'use strict';

const HTTPClient = require('./HTTPClient');

module.exports = class ECBCurrencyClient extends HTTPClient {

  constructor(logger) {
    super(null, logger);
  }

  getEuroCurrencyRate(currency) {

    let url = `https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.${currency}.EUR.SP00.A?includeHistory=false&lastNObservations=1&detail=dataonly`;

    return this.performGetRequest(url, {
      headers: { 'Accept': 'application/vnd.sdmx.data+json;version=1.0.0-wd' }
    })

    .catch(err => {throw new Error(err)})

    .then(resp => resp.body)
    .then(body => JSON.parse(body))
    .then(data => parseFloat(data.dataSets[0]['series']['0:0:0:0:0']['observations']['0'][0]) )



  }




}
