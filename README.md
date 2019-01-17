# ethereum-audit

A library to write audit records on the Ethereum blockchain

## Installation

```bash
npm install
```

## Usage

```
const EthAudit = require('ethereum-audit');
```

## Test

```
Usage: node test_eth_audit.js [options]
       DEBUG=eth_audit_log node test_eth_audit.js [options]
Options:
  -u    unlock the ETH account for sending transactions
  -a    query the ETH accounts in the node
  -i    insert audit data (reqbody.key, reqbody.data)
  -d    get audit data (reqbody.key)
  -c    get audit data count
  -k    get audit key (reqbody.index)
  -o    add a new owner who is authorized to insert audit data (reqbody.addr)
  -w    check whether the account address is one of the owners (reqbody.addr)
  -l    get all audit data
```


TODO
