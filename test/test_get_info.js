"use strict";

var reqbody = require('./reqbody.json');
var EthAudit = require('../lib/ethereum-audit.js');
const assert = require('assert');
const config = require('../data/config.json');
config.CONTRACT_ADDR = process.env.contract_address;
const ethaudit = new EthAudit(config);

async function main() {
    var response = await ethaudit.retrieveEthAccounts();
    response = JSON.parse(response);
    assert.strictEqual(response['result'][0], process.env.account1);
    assert.strictEqual(response['result'][1], process.env.account2);
    response = await ethaudit.getAuditDataByKey(reqbody);
    response = JSON.parse(response);
    assert.strictEqual(response['result'], 'testData');
    response = await ethaudit.getAuditDataCount(reqbody);
    response = JSON.parse(response);
    assert.strictEqual(response['result'], '1');
    response = await ethaudit.getAuditKey(reqbody);
    response = JSON.parse(response);
    assert.strictEqual(response['result']['0'], 'testKey');
    response = await ethaudit.checkIsOwner(reqbody);
    response = JSON.parse(response);
    assert.strictEqual(response['result'], true);
    reqbody.addr = process.env.account1;
    response = await ethaudit.checkIsOwner(reqbody);
    response = JSON.parse(response);
    assert.strictEqual(response['result'], false);
    response = await ethaudit.getAuditDataAll();
    response = JSON.parse(response);
    assert.strictEqual(response['result'][0]['testKey'], 'testData');
}

module.exports = main;
if (!module.parent)
    main();