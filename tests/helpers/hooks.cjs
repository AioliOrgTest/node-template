const nock = require('nock');
const test = require('node:test');
const before = test.before;

before(() => {
  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
});
