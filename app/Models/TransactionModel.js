'use strict';

const { Schema } = require('mongoose');

const currencySchema = Schema({
  currency: { type: String, required: true },
  value: { type: Number, required: true }
});

module.exports = Schema({
  createdAt: { type: Date, required: false },
  input: currencySchema,
  output: currencySchema
}, {
  collection: 'transactions',
  strict: true,
  timestamps: { createdAt: 'createdAt' },
  toJSON: {
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      ret.id = doc._id;
    }
  }
});