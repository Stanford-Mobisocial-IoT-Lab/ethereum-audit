# ethereum-audit

A library to write audit records on the Ethereum blockchain

## Installation

```bash
$ npm install
```

## Usage

```
const EthAudit = require('ethereum-audit');
```

## Function Tests

```
Usage:
  $ node test_eth_audit.js [options]
  $ DEBUG=eth_audit_log node test_eth_audit.js [options]
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

## Sample Inputs & Outputs

```
reqbody.json
{
    "key": "testKeyooo",
    "data": "testDataooo",
    "addr": "0x78E030450c0B4f41a97134AA0F77099705f9Bb41",
    "index": "1"
}
```

```bash
$ node test/test_eth_audit.js -u
[Input]  (none)
[Output] {"result":true}
```

```bash
$ node test/test_eth_audit.js -a
[Input]  (none)
[Output] {"result":["0x78E030450c0B4f41a97134AA0F77099705f9Bb41","0x79724b56359De5eb5B368151AF1A16DD7229335f"]}
```

```bash
$ node test/test_eth_audit.js -i
[Input]  reqbody.key, reqbody.data
[Output] {"result":"Transaction is received and written."}
```

```bash
$ node test/test_eth_audit.js -d
[Input]  reqbody.key
[Output] {"result":"testData2"}
```

```bash
$ node test/test_eth_audit.js -c
[Input]  (none)
[Output] {"result":"2"}
```

```bash
$ node test/test_eth_audit.js -k
[Input]  reqbody.index
[Output] {"result":{"1":"testKey2"}}
```

```bash
$ node test/test_eth_audit.js -o
[Input]  reqbody.addr
[Output] {"result":"Transaction is received and written."}
```

```bash
$ node test/test_eth_audit.js -w
[Input]  reqbody.addr
[Output] {"result":true}
```

```bash
$ node test/test_eth_audit.js -l
[Input]  (none)
[Output] {"result":[{"testKey1":"testData1"},{"testKey2":"testData2"}]}
```

## Unitests

```bash
$ npm run test
```

TODO
