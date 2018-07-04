'use strict';

const { Router } = require('express');
const ForbiddenResourceError = require('../../Errors/ForbiddenResourceError');

const PAGE_KEY = 'page',
      PAGELEN_KEY = 'pagelen',
      DEFAULT_PAGELEN = 20;

module.exports = class BaseController {

    constructor() {
        this.router = Router();
    }

    getRouter() {
        return this.router;
    }

    getCollectionPayload$(list$, count$, pagelen, page) {
        return list$.zip(count$, (data, total) => {
            return {pagelen, page, total, data};
        });
    }

    getItemPayload$(find$) {
        return find$.map((data) => {
            return {data};
        });
    }

    parsePage(req) {
        return parseInt(req.query[PAGE_KEY] ? req.query[PAGE_KEY] : 1);
    }

    parsePagelen(req) {
        return parseInt(req.query[PAGELEN_KEY] ? req.query[PAGELEN_KEY] : DEFAULT_PAGELEN);
    }

}
