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
// Author: Wesley Liu <>
//         Alison Lin
"use strict";

const minimist = require('minimist');
var Web3 = require('web3');
var solc = require('solc');
var fs = require('fs');
var config = require('../data/config.json');
var args = minimist(process.argv.slice(1), {
    alias: {
        c: 'compile',
    }
});

var web3 = new Web3(new Web3.providers.HttpProvider(config.ETHRPC_IP_PORT));

if (args.compile) {
    console.log('contract compiling...');
    var source = fs.readFileSync('../data/AuditContract.sol', 'utf8');
    var output = solc.compile(source, 1);
    var contractData = '0x' + output.contracts[':AuditContract'].bytecode;
    var contractABI = output.contracts[':AuditContract'].interface;
    config.CONTRACT_BYTECODE = contractData;
    config.CONTRACT_ABI = contractABI;
    contractABI = JSON.parse(contractABI);
} else {
    contractData = config.CONTRACT_BYTECODE;
    contractABI = config.CONTRACT_ABI;
}

web3.eth.personal.unlockAccount(config.COINBASE_ACCOUNT, config.PASSPHRASE, 10)
    .then((result) => {
        console.log('unlockAccount success');
        console.log('deploy contract');
        var Contract = new web3.eth.Contract(contractABI);
        Contract.deploy({ data: contractData }).send({
            from: config.COINBASE_ACCOUNT,
            gas: config.GAS,
            gasPrice: config.GAS_PRICE
        }).on('receipt', (receipt) => {
            console.log('receipt contractAddress:' + receipt.contractAddress);
            config.CONTRACT_ADDR = receipt.contractAddress;
            config = JSON.stringify(config, null, 4);
            //replace \g  -> 
            //replace "[{ -> [{
            //replace }]" -> }]
            config = config.replace(/\\/g, "");
            config = config.replace(/"\[\{/g, "[{");
            config = config.replace(/\}\]"/g, "}]");
            fs.writeFileSync('../data/config.json', config, "utf8", (err) => {
                if (err) throw err;
                console.log('The config file has been saved!');
            });
        }).catch((error) => {
            console.log('deploy fail, error: ' + error);
        });
    }).catch((error) => {
        console.log('unlockAccount fail, error: ' + error);
    });