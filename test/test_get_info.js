"use strict";

var reqbody = require('./reqbody.json');
var EthAudit = require('../lib/ethereum-audit.js');
const assert = require('assert');
const config = require('./test_config.json');
const ethaudit = new EthAudit(config);

async function main() {
    var response = await ethaudit.getAuditDataByKey(reqbody);
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
    response = await ethaudit.getAuditDataAll();
    response = JSON.parse(response);
    assert.strictEqual(response['result'][0]['testKey'], 'testData');
}

module.exports = main;
if (!module.parent)
    main();