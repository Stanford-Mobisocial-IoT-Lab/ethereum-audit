"use strict";

var reqbody = require('./reqbody.json');
var EthAudit = require('../lib/ethereum-audit');
const assert = require('assert');
var config = require('../data/config.json');
var ethaudit;
var originConfig;
var originReqbody;

function initialize() {
    config.COINBASE_ACCOUNT = process.env.coinbase_account;
    config.PASSPHRASE = process.env.passphrase;
    config.CONTRACT_ADDR = process.env.contract_address;
    originConfig = JSON.parse(JSON.stringify(config));
    originReqbody = JSON.parse(JSON.stringify(reqbody));
}

function reset() {
    config = JSON.parse(JSON.stringify(originConfig));
    reqbody = JSON.parse(JSON.stringify(originReqbody));
}

async function main() {
    await initialize();

    //test for wrong passphrase
    config.PASSPHRASE='wrongPassphrase';
    ethaudit = new EthAudit(config);
    try {
        await ethaudit.unlockEthAccount();
    } catch (error) {
        assert.strictEqual(error.message, 'Failed to unlock account');
    }

    //test for unauthorized user
    await reset();
    config.COINBASE_ACCOUNT=process.env.account1;
    config.PASSPHRASE=process.env.account1_passphrase;
    ethaudit = new EthAudit(config);
    try {
        await ethaudit.insertAuditData(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Failed to insert audit data');
    }

    //test for wrong key (the return response is undefined)
    reqbody.key='wrongKey';
    try {
        await ethaudit.getAuditDataByKey(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Cannot read property \'getAuditDataByKey\' of undefined');
    }

    //test for wrong key index
    reqbody.index='2';
    try {
        await ethaudit.getAuditKey(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Cannot read property \'getAuditKey\' of undefined');
    }

    //test for wrong contract address
    await reset();
    config.CONTRACT_ADDR='0x487d5c6397efdd5e38fef56f3de34d5bbf21a6bb';
    ethaudit = new EthAudit(config);
    try {
        await ethaudit.getAuditDataByKey(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Failed to get audit data by key');
    }
    try {
        await ethaudit.getAuditDataCount();
    } catch (error) {
        assert.strictEqual(error.message, 'Failed to get audit data count');
    }
    try {
        await ethaudit.getAuditKey(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Failed to get audit key by index');
    }
    try {
        await ethaudit.getAuditDataAll();
    } catch(error) {
        assert.strictEqual(error.message, 'Failed to get all audit data');
    }
    try {
        await ethaudit.checkIsOwner(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Failed to check owner');
    }
}

module.exports = main;
if (!module.parent)
    main();