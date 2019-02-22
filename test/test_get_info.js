"use strict";

let reqbody = require('./reqbody.json');
const EthAudit = require('../lib/ethereum-audit.js');
const assert = require('assert');
const config = require('../data/config.json');
config.CONTRACT_ADDR = process.env.contract_address;
const ethaudit = new EthAudit(config);

async function main() {
    let response = await ethaudit.retrieveEthAccounts();
    assert.strictEqual(response.result[0], process.env.account1);
    assert.strictEqual(response.result[1], process.env.account2);
    response = await ethaudit.getAuditDataByKey(reqbody);
    assert.strictEqual(response.result, 'testData');
    response = await ethaudit.getAuditDataCount(reqbody);
    assert.strictEqual(response.result, '1');
    response = await ethaudit.getAuditKey(reqbody);
    assert.strictEqual(response.index, '0');
    assert.strictEqual(response.result, 'testKey');
    response = await ethaudit.checkIsOwner(reqbody);
    assert.strictEqual(response.result, true);
    reqbody.addr = process.env.account1;
    response = await ethaudit.checkIsOwner(reqbody);
    assert.strictEqual(response.result, false);
    response = await ethaudit.getAuditDataAll();
    assert.strictEqual(response.result[0]['testKey'], 'testData');
}

module.exports = main;
if (!module.parent)
    main();