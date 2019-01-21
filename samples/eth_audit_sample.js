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

const EthAudit = require('../lib/ethereum-audit');
const config = require('./config_sample.json');
const _ethaudit = new EthAudit(config);

// fake data for testing
const reqbody = require('./reqbody_sample.json');

(async function main() {
    for (let option of process.argv.slice(2))
        await testSelect(option);
})();

if (process.argv.slice(2).length === 0)
    testSelect();

async function testSelect(option) {
    switch (option) {
        case '-u':
            try {
                let result = await _ethaudit.unlockEthAccount();
                console.log(result);
            } catch (error) {
                console.log(error);
            }
            break;
        case '-a':
            try {
                let result = await _ethaudit.retrieveEthAccounts();
                console.log(result);
            } catch (error) {
                console.log(error);
            }
            break;
        case '-i':
            try {
                let result = await _ethaudit.insertAuditData(reqbody);
                console.log(result);
            } catch (error) {
                console.log(error);
            }
            break;
        case '-d':
            try {
                let result = await _ethaudit.getAuditDataByKey(reqbody);
                console.log(result);
            } catch (error) {
                console.log(error);
            }
            break;
        case '-c':
            try {
                let result = await _ethaudit.getAuditDataCount();
                console.log(result);
            } catch (error) {
                console.log(error);
            }
            break;
        case '-k':
            try {
                let result = await _ethaudit.getAuditKey(reqbody);
                console.log(result);
            } catch (error) {
                console.log(error);
            }
            break;
        case '-o':
            try {
                let result = await _ethaudit.addNewOwner(reqbody);
                console.log(result);
            } catch (error) {
                console.log(error);
            }
            break;
        case '-w':
            try {
                let result = await _ethaudit.checkIsOwner(reqbody);
                console.log(result);
            } catch (error) {
                console.log(error);
            }
            break;
        case '-l':
            try {
                let result = await _ethaudit.getAuditDataAll();
                console.log(result);
            } catch (error) {
                console.log(error);
            }
            break;
        default:
            // node eth_audit_sample.js -a
            // DEBUG=* node eth_audit_sample.js -a
            // DEBUG=eth_audit_log node eth_audit_sample.js -a
            var msg = 'Usage: node eth_audit_sample.js [options]\n';
            msg += '       DEBUG=eth_audit_log node eth_audit_sample.js [options]\n';
            msg += 'Options: \n';
            msg += '  -u\tunlock the ETH account for sending transactions\n';
            msg += '  -a\tquery the ETH accounts in the node\n';
            msg += '  -i\tinsert audit data (reqbody.key, reqbody.data)\n';
            msg += '  -d\tget audit data (reqbody.key)\n';
            msg += '  -c\tget audit data count\n';
            msg += '  -k\tget audit key (reqbody.index)\n';
            msg += '  -o\tadd a new owner who is authorized to insert audit data (reqbody.addr)\n';
            msg += '  -w\tcheck whether the account address is one of the owners (reqbody.addr)\n';
            msg += '  -l\tget all audit data\n';
            console.log(msg);
            break;
    }
}
