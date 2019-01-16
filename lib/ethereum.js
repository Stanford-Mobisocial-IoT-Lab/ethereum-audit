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

const Web3 = require("web3");
const fs = require('fs');
const util = require('util');
const config = require("./config.json");
var web3, response;

// ------------------------------------------------------
// General Functions [exports]
//   exports.retrieveEthAccounts()
//   exports.unlockEthAccount()
// ------------------------------------------------------
exports.retrieveEthAccounts = function (callback) {
  connectAndObtainWeb3Obj(config, function (error, web3) {
    if (error) {
      processLog(config.SRC_NAME, 'retrieveEthAccounts(0)', error);
      callback(JSON.stringify({error}), null);
    } else {
      web3.eth.getAccounts()
        .then(function (result) {
          processLog(config.SRC_NAME, 'retrieveEthAccounts(1)', result);
          callback(null, JSON.stringify({result}));
        }).catch(function (error) {
          processLog(config.SRC_NAME, 'retrieveEthAccounts(2)', error);
          callback(JSON.stringify({error}), null);
        });
    }
  });
};

exports.unlockEthAccount = function (callback) {
  connectAndObtainWeb3Obj(config, function (error, web3) {
    if (error) {
      processLog(config.SRC_NAME, 'unlockEthAccount(0)', error);
      callback(JSON.stringify({error}), null);
    } else {
      web3.eth.personal.unlockAccount(config.COINBASE_ACCOUNT, config.PASSPHRASE, 0)
        .then(function (result) {
          processLog(config.SRC_NAME, 'unlockEthAccount(1)', result);
          callback(null, JSON.stringify({result}));
        }).catch(function (error) {
          processLog(config.SRC_NAME, 'unlockEthAccount(2)', error);
          callback(JSON.stringify({error}), null);
        });
    }
  });
};

// ------------------------------------------------------
// Specialized Functions [exports]
//   exports.insertAuditData(reqbody)
//   exports.getAuditDataByKey(reqbody)
//   exports.getAuditDataCount()
//   exports.getAuditKey(reqbody)
//   exports.addNewOwner(reqbody)
//   exports.checkIsOwner(reqbody)
//   exports.getAuditDataAll(reqbody)
// ------------------------------------------------------
exports.insertAuditData = function (reqbody, callback) {
  if (reqbody.key === "" || reqbody.key === undefined || reqbody.data === "" || reqbody.data === undefined) {
    const error = "Inserted values are empty.";
    processLog(config.SRC_NAME, 'insertAuditData(0)', error);
    callback(JSON.stringify({error}), null);
  } else {
    connectAndAccessContract(config, function (error, contract) {
      if (error) {
        processLog(config.SRC_NAME, 'insertAuditData(1)', error);
        callback(JSON.stringify({error}), null);
      } else {
        _insertAuditData(contract, reqbody.key, reqbody.data, function (error, response) {
          if (error) {
            processLog(config.SRC_NAME, 'insertAuditData(2)', error);
            callback(JSON.stringify({error}), null);
          } else {
            processLog(config.SRC_NAME, 'insertAuditData(3)', response);
            callback(null, JSON.stringify({response}));
          }
        });
      }
    });
  }
};

exports.getAuditDataByKey = function (reqbody, callback) {
  if (reqbody.key === "" || reqbody.key === undefined) {
    const error = "Inserted values are empty.";
    processLog(config.SRC_NAME, 'getAuditDataByKey(0)', error);
    callback(JSON.stringify({error}), null);
  } else {
    connectAndAccessContract(config, function (error, contract) {
      if (error) {
        processLog(config.SRC_NAME, 'getAuditDataByKey(1)', error);
        callback(JSON.stringify({error}), null);
      } else {
        _getAuditDataByKey(contract, reqbody.key, function (error, response) {
          if (error) {
            processLog(config.SRC_NAME, 'getAuditDataByKey(2)', error);
            callback(JSON.stringify({error}), null);
          } else {
            processLog(config.SRC_NAME, 'getAuditDataByKey(3)', response);
            var obj = {};
            obj[reqbody.key] = response;
            callback(null, JSON.stringify(obj));
          }
        });
      }
    });
  }
};

exports.getAuditDataCount = function (callback) {
  connectAndAccessContract(config, function (error, contract) {
    if (error) {
      processLog(config.SRC_NAME, 'getAuditDataCount(0)', error);
      callback(JSON.stringify({error}), null);
    } else {
      _getAuditDataCount(contract, function (error, response) {
        if (error) {
          processLog(config.SRC_NAME, 'getAuditDataCount(1)', error);
          callback(JSON.stringify({error}), null);
        } else {
          processLog(config.SRC_NAME, 'getAuditDataCount(2)', response);
          callback(null, JSON.stringify({response}));
        }
      });
    }
  });
};

exports.getAuditKey = function (reqbody, callback) {
  if (reqbody.index === "" || reqbody.index === undefined) {
    const error = "Inserted values are empty.";
    processLog(config.SRC_NAME, 'getAuditKey(0)', error);
    callback(JSON.stringify({error}), null);
  } else {
    connectAndAccessContract(config, function (error, contract) {
      if (error) {
        processLog(config.SRC_NAME, 'getAuditKey(1)', error);
        callback(JSON.stringify({error}), null);
      } else {
        _getAuditKey(contract, reqbody.index, function (error, response) {
          if (error) {
            processLog(config.SRC_NAME, 'getAuditKey(2)', error);
            callback(JSON.stringify({error}), null);
          } else {
            processLog(config.SRC_NAME, 'getAuditKey(3)', response);
            var obj = {};
            obj[reqbody.index] = response;
            callback(null, JSON.stringify(obj));
          }
        });
      }
    });
  }
};

exports.addNewOwner = function (reqbody, callback) {
  if (reqbody.addr === "" || reqbody.addr === undefined) {
    const error = "Inserted values are empty.";
    processLog(config.SRC_NAME, 'addNewOwner(0)', error);
    callback(JSON.stringify({error}), null);
  } else {
    connectAndAccessContract(config, function (error, contract) {
      if (error) {
        processLog(config.SRC_NAME, 'addNewOwner(1)', error);
        callback(JSON.stringify({error}), null);
      } else {
        _addNewOwner(contract, reqbody.addr, function (error, response) {
          if (error) {
            processLog(config.SRC_NAME, 'addNewOwner(2)', error);
            callback(JSON.stringify({error}), null);
          } else {
            processLog(config.SRC_NAME, 'addNewOwner(3)', response);
            callback(null, JSON.stringify({response}));
          }
        });
      }
    });
  }
};

exports.checkIsOwner = function (reqbody, callback) {
  connectAndAccessContract(config, function (error, contract) {
    if (error) {
      processLog(config.SRC_NAME, 'checkIsOwner(0)', error);
      callback(JSON.stringify({error}), null);
    } else {
      _checkIsOwner(contract, reqbody.addr, function (error, response) {
        if (error) {
          processLog(config.SRC_NAME, 'checkIsOwner(1)', error);
          callback(JSON.stringify({error}), null);
        } else {
          processLog(config.SRC_NAME, 'checkIsOwner(2)', response);
          callback(null, JSON.stringify({response}));
        }
      });
    }
  });
};

exports.getAuditDataAll = function (callback) {
  connectAndAccessContract(config, function (error, contract) {
    if (error) {
      processLog(config.SRC_NAME, 'getAuditDataAll(0)', error);
      callback(JSON.stringify({error}), null);
    } else {
      _getAuditDataAll(contract, function (error, response) {
        if (error) {
          processLog(config.SRC_NAME, 'getAuditDataAll(1)', error);
          callback(JSON.stringify({error}), null);
        } else {
          processLog(config.SRC_NAME, 'getAuditDataAll(2)', response);
          callback(null, JSON.stringify({response}));
        }
      });
    }
  });
};

// ------------------------------------------------------
// Specialized Functions [inner]
//   _insertAuditData(contract, key, data)
//   _getAuditDataByKey(contract, key)
//   _getAuditDataCount(contract)
//   _getAuditKey(contract, index)
//   _addNewOwner(contract, addr)
//   _checkIsOwner(contract, addr)
//   _getAuditDataAll(contract)
// ------------------------------------------------------
function _insertAuditData (contract, key, data, callback) {
  contract.methods.insertAuditData(key, data).send({
    from: config.COINBASE_ACCOUNT,
    gas: config.GAS,
    gasPrice: config.GASPRICE
  }).on('transactionHash', function (hash) {
    response = 'Transaction is sent: ' + hash;
    processLog(config.SRC_NAME, 'insertAuditData(4)', response);
  }).on('receipt', function (receipt) {
    response = 'Transaction is received and written.';
    processLog(config.SRC_NAME, 'insertAuditData(5)', response);
    //processLog(config.SRC_NAME, 'insertAuditData(6)', util.inspect(receipt));
    callback(null, response); // waiting until transaction is written on blockchain.
    //}).on('confirmation', function(confNumber, receipt) {
    //response = 'Confirmation:' + confNumber;
    //processLog(config.SRC_NAME, 'insertAuditData(7)', response);
  }).on('error', function (err) {
    const error = '[Failed to send new data] ';
    processLog(config.SRC_NAME, 'insertAuditData(8)', error + err);
    callback(error + err, null);
  });
}

function _getAuditDataByKey (contract, key, callback) {
  contract.methods.getAuditData(key).call({
    from: config.COINBASE_ACCOUNT
  }, function (error, response) {
    if (error) {
      processLog(config.SRC_NAME, 'getAuditDataByKey(4)', error);
      callback(error, null);
    } else {
      if (error) {
        processLog(config.SRC_NAME, 'getAuditDataByKey(5)', error);
        callback(error, null);
      } else {
        processLog(config.SRC_NAME, 'getAuditDataByKey(6)', response);
        callback(null, response);
      }
    }
  });
}

function _getAuditDataCount (contract, callback) {
  contract.methods.getAuditDataCount().call({
    from: config.COINBASE_ACCOUNT
  }, function (error, response) {
    if (error) {
      processLog(config.SRC_NAME, 'getAuditDataCount(4)', error);
      callback(error, null);
    } else {
      if (error) {
        processLog(config.SRC_NAME, 'getAuditDataCount(5)', error);
        callback(error, null);
      } else {
        processLog(config.SRC_NAME, 'getAuditDataCount(6)', response);
        callback(null, response);
      }
    }
  });
}

function _getAuditKey (contract, index, callback) {
  contract.methods.getAuditKey(index).call({
    from: config.COINBASE_ACCOUNT
  }, function (error, response) {
    if (error) {
      processLog(config.SRC_NAME, 'getAuditKey(4)', error);
      callback(error, null);
    } else {
      if (error) {
        processLog(config.SRC_NAME, 'getAuditKey(5)', error);
        callback(error, null);
      } else {
        processLog(config.SRC_NAME, 'getAuditKey(6)', response);
        callback(null, response);
      }
    }
  });
}

function _addNewOwner (contract, addr, callback) {
  contract.methods.addNewOwner(addr).send({
    from: config.COINBASE_ACCOUNT,
    gas: config.GAS,
    gasPrice: config.GASPRICE
  }).on('transactionHash', function (hash) {
    response = 'Transaction is sent: ' + hash;
    processLog(config.SRC_NAME, 'addNewOwner(4)', response);
  }).on('receipt', function (receipt) {
    response = 'Transaction is received and written.';
    processLog(config.SRC_NAME, 'addNewOwner(5)', response);
    //processLog(config.SRC_NAME, 'addNewOwner(6)', util.inspect(receipt));
    callback(null, response); // waiting until transaction is written on blockchain.
    //}).on('confirmation', function(confNumber, receipt) {
    //response = 'Confirmation:' + confNumber;
    //processLog(config.SRC_NAME, 'addNewOwner(7)', response);
  }).on('error', function (err) {
    const error = '[Failed to send new owner] ';
    processLog(config.SRC_NAME, 'addNewOwner(8)', error + err);
    callback(error + err, null);
  });
}

function _checkIsOwner (contract, addr, callback) {
  contract.methods.checkIsOwner(addr).call({
    from: config.COINBASE_ACCOUNT
  }, function (error, response) {
    if (error) {
      processLog(config.SRC_NAME, 'checkIsOwner(4)', error);
      callback(error, null);
    } else {
      if (error) {
        processLog(config.SRC_NAME, 'checkIsOwner(5)', error);
        callback(error, null);
      } else {
        processLog(config.SRC_NAME, 'checkIsOwner(6)', response);
        callback(null, response);
      }
    }
  });
}

function _getAuditDataAll (contract, callback) {
  contract.methods.getAuditDataCount().call(function (error, result) {
    if (error) {
      processLog(config.SRC_NAME, 'getAuditDataAll(3)', error);
      callback(error, null);
    }
    else {
      //console.log('data count = ' + result);
      var response = [], dataCount = parseInt(result);
      for (var i = 0; i < dataCount; i++) {
        contract.methods.getAuditKey(i).call(function (error, result_key) {
          if (error) {
            processLog(config.SRC_NAME, 'getAuditDataAll(4)', error);
            callback(error, null);
          }
          else {
            //console.log(result_key);
            contract.methods.getAuditData(result_key).call(function (error, result_data) {
              if (error) {
                processLog(config.SRC_NAME, 'getAuditDataAll(5)', error);
                callback(error, null);
              }
              else {
                //console.log('audit data key = ' + result_key);
                //console.log('audit data key = ' + result_data);
                var obj = {};
                obj[result_key] = result_data;
                response.push(obj);
                if(response.length === dataCount) {
                  processLog(config.SRC_NAME, 'getAuditDataAll(6)', response);
                  callback(null, response);
                }
              }
            });
          }
        });
      }
    }
  });
}

// ------------------------------------------------------
// General Functions [inner]
//   connectAndObtainWeb3Obj(config)
//   connectAndAccessContract(config)
// ------------------------------------------------------
function connectAndObtainWeb3Obj (config, callback) {
  web3 = new Web3(new Web3.providers.HttpProvider(config.ETHRPC_IP_PORT));
  processLog(config.SRC_NAME, 'connectAndObtainWeb3Obj(0)', web3.version);
  if (!web3.version) callback('Web3 object error', web3);
  else callback(null, web3);
}

function connectAndAccessContract (config, callback) {
  web3 = new Web3(new Web3.providers.HttpProvider(config.ETHRPC_IP_PORT));
  var contract = new web3.eth.Contract(config.CONTRACT_ABI, config.CONTRACT_ADDR);
  processLog(config.SRC_NAME, 'connectAndAccessContract(0)', contract._address);
  if (!contract._address) callback('Contract object error', null);
  else callback(null, contract);
}

// ------------------------------------------------------
// Utility Functions [inner]
//   processLog(srcFileName, funcName, message)
// ------------------------------------------------------
function processLog (srcFileName, funcName, message) {
  //console.log(funcName + ': ' + util.inspect(message) + '\n');
  //if (util.inspect(message).search("Invalid JSON RPC response") == -1) return;

  var filePath = config.LOGFILE_DIR;
  if (!fs.existsSync(filePath))
    fs.mkdirSync(filePath);

  var nowDate = new Date();
  var timeFileName = nowDate.getFullYear() + "_" + (nowDate.getMonth() + 1) + "_" + nowDate.getDate();
  //+ "_" + nowDate.getHours() + "_" + nowDate.getMinutes();
  var logFileName = filePath + "log-" + timeFileName + "-" + srcFileName + ".log";
  var logMessage = "[" + nowDate + "] " + funcName + ": " + util.inspect(message) + '\n';
  //console.log(logMessage);

  fs.appendFileSync(logFileName, logMessage, function (error) {
    if (error)
      console.log(error);
  });
}
