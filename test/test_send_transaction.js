"use strict";

var reqbody = require('./reqbody.json');
var EthAudit = require('../lib/ethereum-audit.js');
const assert = require('assert');
const config = require('../data/config.json');
config.COINBASE_ACCOUNT = process.env.coinbase_account;
config.PASSPHRASE = process.env.passphrase;
config.CONTRACT_ADDR = process.env.contract_address;
const ethaudit = new EthAudit(config);

async function main() {
    var response = await ethaudit.insertAuditData(reqbody);
    response = JSON.parse(response);
    assert.strictEqual(response['result'], 'Transaction is received and written.');
    response = await ethaudit.addNewOwner(reqbody);
    response = JSON.parse(response);
    assert.strictEqual(response['result'], 'Transaction is received and written.');
}

module.exports = main;
if (!module.parent)
    main();