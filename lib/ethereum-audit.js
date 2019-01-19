// -*- mode: js; indent-tabs-mode: nil; js-basic-offset: 4 -*-
//
// This file is part of ethereum-audit
//
// Copyright 2019 DeepQ
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Author: Alison Lin <yslin1013@gmail.com>

"use strict";

const Web3 = require('web3');
const util = require('util');
const logger = require('debug')('eth_audit_log');

module.exports = class EthAudit {
    constructor(config) {
        this._config = config;
        this._web3 = new Web3(new Web3.providers.HttpProvider(config.ETHRPC_IP_PORT));
    }

    async unlockEthAccount() {
        if (this._config.COINBASE_ACCOUNT === '' || this._config.COINBASE_ACCOUNT === undefined)
            throw Error('COINBASE_ACCOUNT is not defined.');
        if (this._config.PASSPHRASE === '' || this._config.PASSPHRASE === undefined)
            throw Error('PASSPHRASE is not defined.');
        try {
            let web3 = await this.connectAndObtainWeb3Obj();
            let result = await web3.eth.personal.unlockAccount(this._config.COINBASE_ACCOUNT, this._config.PASSPHRASE, 60);
            logger('unlockEthAccount(1): ' + util.inspect(result));
            return JSON.stringify({
                result
            });
        } catch (error) {
            logger('unlockEthAccount(2): ' + (error.stack || error));
            throw Error('Failed to unlock account');
        }
    }

    async retrieveEthAccounts() {
        try {
            let web3 = await this.connectAndObtainWeb3Obj();
            let result = await web3.eth.getAccounts();
            logger('retrieveEthAccounts(1): ' + util.inspect(result));
            return JSON.stringify({
                result
            });
        } catch (error) {
            logger('retrieveEthAccounts(2): ' + (error.stack || error));
            throw Error('Failed to retrieve ETH accounts');
        }
    }

    async insertAuditData(reqbody) {
        if (reqbody.key === '' || reqbody.key === undefined || reqbody.data === '' || reqbody.data === undefined) {
            const error = 'Inserted values are empty.';
            logger('insertAuditData(0): ' + error);
            throw Error(error);
        } else {
            try {
                let contract = await this.connectAndAccessContract();
                let result = await this._insertAuditData(contract, reqbody.key, reqbody.data);
                logger('insertAuditData(1): ' + util.inspect(result));
                return JSON.stringify({
                    result
                });
            } catch (error) {
                logger('insertAuditData(2): ' + (error.stack || error));
                throw Error('Failed to insert audit data');
            }
        }
    }

    async getAuditDataByKey(reqbody) {
        if (reqbody.key === '' || reqbody.key === undefined) {
            const error = 'Inserted values are empty.';
            logger('getAuditDataByKey(0): ' + (error.stack || error));
            throw Error(error);
        } else {
            try {
                let contract = await this.connectAndAccessContract();
                let result = await this._getAuditDataByKey(contract, reqbody.key);
                logger('getAuditDataByKey(1): ' + util.inspect(result));
                return JSON.stringify({
                    result
                });
            } catch (error) {
                logger('getAuditDataByKey(2): ' + (error.stack || error));
                throw Error('Failed to get audit data by key');
            }
        }
    }

    async getAuditDataCount() {
        try {
            let contract = await this.connectAndAccessContract();
            let result = await this._getAuditDataCount(contract);
            logger('getAuditDataCount(1): ' + util.inspect(result));
            return JSON.stringify({
                result
            });
        } catch (error) {
            logger('getAuditDataCount(2): ' + (error.stack || error));
            throw Error('Failed to get audit data count');
        }
    }

    async getAuditKey(reqbody) {
        if (reqbody.index === '' || reqbody.index === undefined) {
            const error = 'Inserted values are empty.';
            logger('getAuditKey(0): ' + (error.stack || error));
            throw Error(error);
        } else {
            try {
                let contract = await this.connectAndAccessContract();
                let response = await this._getAuditKey(contract, reqbody.index);
                logger('getAuditKey(1): ' + util.inspect(response));
                let result = {};
                result[reqbody.index] = response;
                return JSON.stringify({
                    result
                });
            } catch (error) {
                logger('getAuditKey(2): ' + (error.stack || error));
                throw Error('Failed to gey audit key by index');
            }
        }
    }

    async addNewOwner(reqbody) {
        if (reqbody.addr === '' || reqbody.addr === undefined) {
            const error = 'Inserted values are empty.';
            logger('addNewOwner(0): ' + (error.stack || error));
            throw Error(error);
        } else {
            try {
                let contract = await this.connectAndAccessContract();
                let result = await this._addNewOwner(contract, reqbody.addr);
                logger('addNewOwner(1): ' + util.inspect(result));
                return JSON.stringify({
                    result
                });
            } catch (error) {
                logger('addNewOwner(2): ' + (error.stack || error));
                throw Error('Failed to add a new owner');
            }
        }
    }

    async checkIsOwner(reqbody) {
        if (reqbody.addr === '' || reqbody.addr === undefined) {
            const error = 'Inserted values are empty.';
            logger('checkIsOwner(0): ' + (error.stack || error));
            throw Error(error);
        } else {
            try {
                let contract = await this.connectAndAccessContract();
                let result = await this._checkIsOwner(contract, reqbody.addr);
                logger('checkIsOwner(1): ' + util.inspect(result));
                return JSON.stringify({
                    result
                });
            } catch (error) {
                logger('checkIsOwner(2): ' + (error.stack || error));
                throw Error('Failed to check owner');
            }
        }
    }

    async getAuditDataAll() {
        try {
            let contract = await this.connectAndAccessContract();
            let result = await this._getAuditDataAll(contract);
            logger('getAuditDataAll(1): ' + util.inspect(result));
            return JSON.stringify({
                result
            });
        } catch (error) {
            logger('getAuditDataAll(2): ' + (error.stack || error));
            throw Error('Failed to get all audit data');
        }
    }

    _insertAuditData(contract, key, data) {
        return new Promise((resolve, reject) => {
            if (this._config.COINBASE_ACCOUNT === '' || this._config.COINBASE_ACCOUNT === undefined)
                reject(Error('COINBASE_ACCOUNT is not defined.'));
            if (this._config.GAS === '' || this._config.GAS === undefined)
                reject(Error('GAS is not defined.'));
            if (this._config.GAS_PRICE === '' || this._config.GAS_PRICE === undefined)
                reject(Error('GAS_PRICE is not defined.'));
            contract.methods.insertAuditData(key, data).send({
                from: this._config.COINBASE_ACCOUNT,
                gas: this._config.GAS,
                gasPrice: this._config.GAS_PRICE
            }).on('transactionHash', (hash) => {
                let response = 'Transaction is sent: ' + hash;
                logger('_insertAuditData(3): ' + util.inspect(response));
            }).on('receipt', (receipt) => {
                let response = 'Transaction is received and written.';
                logger('_insertAuditData(4): ' + util.inspect(response));
                logger('_insertAuditData(5): ' + util.inspect(receipt));
                resolve(response);
                //}).on('confirmation', (confNumber, receipt) => {
                //let response = 'Confirmation:' + confNumber;
                //logger('_insertAuditData(6): ' + util.inspect(response));
                //logger('_insertAuditData(7): ' + util.inspect(receipt));
            }).on('error', (err) => {
                const error = 'Failed to send new data: ' + err;
                logger('_insertAuditData(8): ' + (error.stack || error));
                reject(error);
            });
        });
    }

    async _getAuditDataByKey(contract, key) {
        try {
            let result = await contract.methods.getAuditData(key).call();
            logger('_getAuditDataByKey(3): ' + util.inspect(result));
            return result;
        } catch (error) {
            logger('_getAuditDataByKey(4): ' + (error.stack || error));
            throw Error(error);
        }
    }

    async _getAuditDataCount(contract) {
        try {
            let result = await contract.methods.getAuditDataCount().call();
            logger('_getAuditDataCount(1): ' + util.inspect(result));
            return result;
        } catch (error) {
            logger('_getAuditDataCount(2): ' + (error.stack || error));
            throw Error(error);
        }
    }

    async _getAuditKey(contract, index) {
        try {
            let result = await contract.methods.getAuditKey(index).call();
            logger('_getAuditKey(3): ' + util.inspect(result));
            return result;
        } catch (error) {
            this.printDebugLog('_getAuditKey(4): ', error);
            logger('_getAuditKey(4): ' + (error.stack || error));
            throw Error(error);
        }
    }

    _addNewOwner(contract, addr) {
        if (this._config.COINBASE_ACCOUNT === '' || this._config.COINBASE_ACCOUNT === undefined)
            throw Error('config: COINBASE_ACCOUNT is not defined.');
        if (this._config.GAS === '' || this._config.GAS === undefined)
            throw Error('config: GAS is not defined.');
        if (this._config.GAS_PRICE === '' || this._config.GAS_PRICE === undefined)
            throw Error('config: GAS_PRICE is not defined.');
        return new Promise((resolve, reject) => {
            contract.methods.addNewOwner(addr).send({
                from: this._config.COINBASE_ACCOUNT,
                gas: this._config.GAS,
                gasPrice: this._config.GAS_PRICE
            }).on('transactionHash', (hash) => {
                let response = 'Transaction is sent: ' + hash;
                logger('_addNewOwner(3): ' + util.inspect(response));
            }).on('receipt', (receipt) => {
                let response = 'Transaction is received and written.';
                logger('_addNewOwner(4): ' + util.inspect(response));
                logger('_addNewOwner(5): ' + util.inspect(receipt));
                resolve(response);
                //}).on('confirmation', (confNumber, receipt) => {
                //let response = 'Confirmation:' + confNumber;
                //logger('_addNewOwner(6): ' + util.inspect(receipt));
                //logger('_addNewOwner(7): ' + util.inspect(response));
            }).on('error', (err) => {
                const error = 'Failed to send a new owner: ' + err;
                logger('_addNewOwner(8): ' + (error.stack || error));
                reject(error);
            });
        });
    }

    async _checkIsOwner(contract, addr) {
        try {
            let result = await contract.methods.checkIsOwner(addr).call();
            logger('_checkIsOwner(3): ' + util.inspect(result));
            return result;
        } catch (error) {
            logger('_checkIsOwner(4): ' + (error.stack || error));
            throw Error(error);
        }
    }

    async _getAuditDataAll(contract) {
        try {
            let response = await contract.methods.getAuditDataCount().call();
            let result = [],
                dataCount = parseInt(response);
            for (let i = 0; i < dataCount; i++) {
                let resultKey = await contract.methods.getAuditKey(i).call();
                let resultData = await contract.methods.getAuditData(resultKey).call();
                let obj = {};
                obj[resultKey] = resultData;
                result.push(obj);
            }
            logger('_getAuditDataAll(3): ' + util.inspect(result));
            return result;
        } catch (error) {
            logger('_getAuditDataAll(4): ' + (error.stack || error));
            throw Error(error);
        }
    }

    connectAndObtainWeb3Obj() {
        return new Promise((resolve, reject) => {
            let web3 = this._web3;
            logger('connectAndObtainWeb3Obj(0): ' + util.inspect(web3.version));
            if (!web3.version) reject(Error('Web3 object error'));
            else resolve(web3);
        });
    }

    connectAndAccessContract() {
        return new Promise((resolve, reject) => {
            if (this._config.CONTRACT_ABI === '' || this._config.CONTRACT_ABI === undefined)
                reject(Error('CONTRACT_ABI is not defined.'));
            if (this._config.CONTRACT_ADDR === '' || this._config.CONTRACT_ADDR === undefined)
                reject(Error('CONTRACT_ADDR is not defined.'));
            let web3 = this._web3;
            let contract = new web3.eth.Contract(this._config.CONTRACT_ABI, this._config.CONTRACT_ADDR);
            logger('connectAndAccessContract(0): ' + util.inspect(contract._address));
            if (!contract._address) reject(Error('Contract object error'));
            else resolve(contract);
        });
    }
};