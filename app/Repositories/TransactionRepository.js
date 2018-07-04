'use strict';

const MongoRepository = require('./MongoRepository');

module.exports = class TransactionRepository extends MongoRepository {

    constructor(schemas) {
      super(schemas);
      this.modelName = 'Transaction';
    }

}


