// fake data for testing
var reqbody = require("./reqbody.json");
var ethapi = require('./ethereum.js');

var option = process.argv[2];
switch (option) {
  case 'unlock':
    // unlock the ETH account for sending transactions
    ethapi.unlockEthAccount(function (error, result) {
      if (error) console.log(error);
      else console.log(result);
    });
    break;
  case 'accounts':
    // query the ETH accounts in the node
    ethapi.retrieveEthAccounts(function (error, result) {
      if (error) console.log(error);
      else console.log(result);
    });
    break;
  case 'insert-audit-data':
    // insert audit data (key, data)
    ethapi.insertAuditData(reqbody, function (error, result) {
      if (error) console.log(error);
      else console.log(result);
    });
    break;
  case 'get-data-by-key':
    // get audit data (key)
    ethapi.getAuditDataByKey(reqbody, function (error, result) {
      if (error) console.log(error);
      else console.log(result);
    });
  break;
  case 'get-data-count':
    // get audit data count
    ethapi.getAuditDataCount(function (error, result) {
      if (error) console.log(error);
      else console.log(result);
    });
    break;
  case 'get-audit-key':
    // get audit key (index)
    ethapi.getAuditKey(reqbody, function (error, result) {
      if (error) console.log(error);
      else console.log(result);
    });
    break;
  case 'add-new-owner':
    // add a new owner who is authorized to insert audit data
    ethapi.addNewOwner(reqbody, function (error, result) {
      if (error) console.log(error);
      else console.log(result);
    });
    break;
  case 'check-is-owner':
    // check whether the account address is one of the owners
    ethapi.checkIsOwner(reqbody, function (error, result) {
      if (error) console.log(error);
      else console.log(result);
    });
    break;
  case 'get-data-all':
    // get all audit data
    ethapi.getAuditDataAll(function (error, result) {
      if (error) console.log(error);
      else console.log(result);
    });
    break;
  default:
    console.log("Usage: node audit.js [option]");
    break;
}
