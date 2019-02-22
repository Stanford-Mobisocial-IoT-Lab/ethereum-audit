"use strict";

const reqbody = require('./reqbody.json');
const EthAudit = require('../lib/ethereum-audit.js');
const assert = require('assert');
const config = require('../data/config.json');
config.COINBASE_ACCOUNT = process.env.coinbase_account;
config.PASSPHRASE = process.env.passphrase;
config.CONTRACT_ADDR = process.env.contract_address;
const ethaudit = new EthAudit(config);

async function main() {
    let response = await ethaudit.unlockEthAccount();
    assert.strictEqual(response, true);
    response = await ethaudit.insertAuditData(reqbody);
    assert.strictEqual(response.msg, 'Transaction is received and written.');
    response = await ethaudit.unlockEthAccount();
    assert.strictEqual(response, true);
    response = await ethaudit.addNewOwner(reqbody);
    assert.strictEqual(response.msg, 'Transaction is received and written.');
}

module.exports = main;
if (!module.parent)
    main();