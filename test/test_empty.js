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
    //test for empty coinbase account
    config.COINBASE_ACCOUNT = '';
    ethaudit = new EthAudit(config);

    try {
        await ethaudit.unlockEthAccount();
    } catch (error) {
        assert.strictEqual(error.message, 'COINBASE_ACCOUNT is not defined.');
    }
    try {
        await ethaudit.insertAuditData(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Failed to insert audit data');
    }
    try {
        reqbody = '';
        await ethaudit.addNewOwner(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Inserted values are empty.');
    }

    //test for empty account's passphase
    await reset();
    config.PASSPHRASE = '';
    ethaudit = new EthAudit(config);

    try {
        await ethaudit.unlockEthAccount();
    } catch (error) {
        assert.strictEqual(error.message, 'PASSPHRASE is not defined.');
    }

    //test for empty key
    await reset();
    reqbody.key = '';
    ethaudit = new EthAudit(config);

    try {
        await ethaudit.insertAuditData(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Inserted values are empty.');
    }
    try {
        await ethaudit.getAuditDataByKey(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Inserted values are empty.');
    }

    //test for empty data
    await reset();
    reqbody.data = '';
    ethaudit = new EthAudit(config);

    try {
        await ethaudit.insertAuditData(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Inserted values are empty.');
    }

    //test for empty index
    await reset();
    reqbody.index = '';
    ethaudit = new EthAudit(config);

    try {
        await ethaudit.getAuditKey(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Inserted values are empty.');
    }

    //test for empty address
    await reset();
    reqbody.addr = '';
    ethaudit = new EthAudit(config);

    try {
        await ethaudit.addNewOwner(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Inserted values are empty.');
    }
    try {
        await ethaudit.checkIsOwner(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Inserted values are empty.');
    }

    //test for empty gas
    await reset();
    config.GAS = '';
    ethaudit = new EthAudit(config);

    try {
        await ethaudit.addNewOwner(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Failed to add a new owner');
    }
    try {
        await ethaudit.insertAuditData(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Failed to insert audit data');
    }


    //test for empty gasprice
    await reset();
    config.GAS_PRICE = '';
    ethaudit = new EthAudit(config);

    try {
        await ethaudit.addNewOwner(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Failed to add a new owner');
    }
    try {
        await ethaudit.insertAuditData(reqbody);
    } catch (error) {
        assert.strictEqual(error.message, 'Failed to insert audit data');
    }

    //test for empty contract abi
    await reset();
    config.CONTRACT_ABI = '';
    ethaudit = new EthAudit(config);

    try {
        await ethaudit.connectAndAccessContract();
    } catch (error) {
        assert.strictEqual(error.message, 'CONTRACT_ABI is not defined.');
    }

    //test for empty contract address
    await reset();
    config.CONTRACT_ADDR = '';
    ethaudit = new EthAudit(config);
    try {
        await ethaudit.connectAndAccessContract();
    } catch (error) {
        assert.strictEqual(error.message, 'CONTRACT_ADDR is not defined.');
    }


}

module.exports = main;
if (!module.parent)
    main();