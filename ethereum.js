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
      callback(error, null);
    } else {
      web3.eth.getAccounts()
        .then(function (result) {
          processLog(config.SRC_NAME, 'retrieveEthAccounts(1)', result);
          callback(null, result);
        }).catch(function (error) {
          processLog(config.SRC_NAME, 'retrieveEthAccounts(2)', error);
          callback(error, null);
        });
    }
  });
};

exports.unlockEthAccount = function (callback) {
  connectAndObtainWeb3Obj(config, function (error, web3) {
    if (error) {
      processLog(config.SRC_NAME, 'unlockEthAccount(0)', error);
      callback(error, null);
    } else {
      // PASSPHRASE placement should be modified
      web3.eth.personal.unlockAccount(config.COINBASE_ACCOUNT, config.PASSPHRASE, 0)
        .then(function (result) {
          processLog(config.SRC_NAME, 'unlockEthAccount(1)', result);
          callback(null, result);
        }).catch(function (error) {
          processLog(config.SRC_NAME, 'unlockEthAccount(2)', error);
          callback(error, null);
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
  if (reqbody.key == "" || reqbody.key == undefined || reqbody.data == "" || reqbody.data == undefined) {
    error = "Inserted values are empty.";
    processLog(config.SRC_NAME, 'insertAuditData(0)', error);
    callback(error, null);
  } else {
    connectAndAccessContract(config, function (error, contract) {
      if (error) {
        processLog(config.SRC_NAME, 'insertAuditData(1)', error);
        callback(error, null);
      } else {
        _insertAuditData(contract, reqbody.key, reqbody.data, function (error, response) {
          if (error) {
            processLog(config.SRC_NAME, 'insertAuditData(2)', error);
            callback(error, null);
          } else {
            processLog(config.SRC_NAME, 'insertAuditData(3)', response);
            callback(null, response);
          }
        });
      }
    });
  }
};

exports.getAuditDataByKey = function (reqbody, callback) {
  if (reqbody.key == "" || reqbody.key == undefined) {
    error = "Inserted values are empty.";
    processLog(config.SRC_NAME, 'getAuditDataByKey(0)', error);
    callback(error, null);
  } else {
    connectAndAccessContract(config, function (error, contract) {
      if (error) {
        processLog(config.SRC_NAME, 'getAuditDataByKey(1)', error);
        callback(error, null);
      } else {
        _getAuditDataByKey(contract, reqbody.key, function (error, response) {
          if (error) {
            processLog(config.SRC_NAME, 'getAuditDataByKey(2)', error);
            callback(error, null);
          } else {
            processLog(config.SRC_NAME, 'getAuditDataByKey(3)', response);
            callback(null, response);
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
      callback(error, null);
    } else {
      _getAuditDataCount(contract, function (error, response) {
        if (error) {
          processLog(config.SRC_NAME, 'getAuditDataCount(1)', error);
          callback(error, null);
        } else {
          processLog(config.SRC_NAME, 'getAuditDataCount(2)', response);
          callback(null, response);
        }
      });
    }
  });
};

exports.getAuditKey = function (reqbody, callback) {
  if (reqbody.index == "" || reqbody.index == undefined) {
    error = "Inserted values are empty.";
    processLog(config.SRC_NAME, 'getAuditKey(0)', error);
    callback(error, null);
  } else {
    connectAndAccessContract(config, function (error, contract) {
      if (error) {
        processLog(config.SRC_NAME, 'getAuditKey(1)', error);
        callback(error, null);
      } else {
        _getAuditKey(contract, reqbody.index, function (error, response) {
          if (error) {
            processLog(config.SRC_NAME, 'getAuditKey(2)', error);
            callback(error, null);
          } else {
            processLog(config.SRC_NAME, 'getAuditKey(3)', response);
            callback(null, response);
          }
        });
      }
    });
  }
};

exports.addNewOwner = function (reqbody, callback) {
  if (reqbody.addr == "" || reqbody.addr == undefined) {
    error = "Inserted values are empty.";
    processLog(config.SRC_NAME, 'addNewOwner(0)', error);
    callback(error, null);
  } else {
    connectAndAccessContract(config, function (error, contract) {
      if (error) {
        processLog(config.SRC_NAME, 'addNewOwner(1)', error);
        callback(error, null);
      } else {
        _addNewOwner(contract, reqbody.addr, function (error, response) {
          if (error) {
            processLog(config.SRC_NAME, 'addNewOwner(2)', error);
            callback(error, null);
          } else {
            processLog(config.SRC_NAME, 'addNewOwner(3)', response);
            callback(null, response);
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
      callback(error, null);
    } else {
      _checkIsOwner(contract, reqbody.addr, function (error, response) {
        if (error) {
          processLog(config.SRC_NAME, 'checkIsOwner(1)', error);
          callback(error, null);
        } else {
          processLog(config.SRC_NAME, 'checkIsOwner(2)', response);
          callback(null, response);
        }
      });
    }
  });
};

exports.getAuditDataAll = function (callback) {
  connectAndAccessContract(config, function (error, contract) {
    if (error) {
      processLog(config.SRC_NAME, 'getAuditDataAll(0)', error);
      callback(error, null);
    } else {
      _getAuditDataAll(contract, function (error, response) {
        if (error) {
          processLog(config.SRC_NAME, 'getAuditDataAll(1)', error);
          callback(error, null);
        } else {
          processLog(config.SRC_NAME, 'getAuditDataAll(2)', response);
          callback(null, response);
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
_insertAuditData = function (contract, key, data, callback) {
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
    error = '[Failed to send new data] ';
    processLog(config.SRC_NAME, 'insertAuditData(8)', error + err);
    callback(error + err, null);
  });
};

_getAuditDataByKey = function (contract, key, callback) {
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
};

_getAuditDataCount = function (contract, callback) {
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
};

_getAuditKey = function (contract, index, callback) {
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
};

_addNewOwner = function (contract, addr, callback) {
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
    error = '[Failed to send new owner] ';
    processLog(config.SRC_NAME, 'addNewOwner(8)', error + err);
    callback(error + err, null);
  });
};

_checkIsOwner = function (contract, addr, callback) {
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
};

_getAuditDataAll = function (contract, callback) {
  contract.methods.getAuditDataCount().call(function (error, result) {
    if (error) {
      processLog(config.SRC_NAME, 'getAuditDataAll(3)', error);
      callback(error, null);
    }
    else {
      //console.log('data count = ' + result);
      var response = [];
      for (var i = 0; i < parseInt(result); i++) {
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
                console.log('audit data key = ' + result_key);
                console.log('audit data key = ' + result_data);
                response.push({ result_key: result_data });                
              }
            })
          }
        })
      }
      //processLog(config.SRC_NAME, 'getAuditDataAll(6)', response);
      //callback(null, response);
    }
  });
};

// ------------------------------------------------------
// General Functions [inner]
//   connectAndObtainWeb3Obj(config)
//   connectAndAccessContract(config)
// ------------------------------------------------------
connectAndObtainWeb3Obj = function (config, callback) {
  web3 = new Web3(new Web3.providers.HttpProvider(config.ETHRPC_IP_PORT));
  processLog(config.SRC_NAME, 'connectAndObtainWeb3Obj(0)', web3.version);
  if (!web3.version) callback('Web3 object error', web3);
  else callback(null, web3);
};

connectAndAccessContract = function (config, callback) {
  web3 = new Web3(new Web3.providers.HttpProvider(config.ETHRPC_IP_PORT));
  var contract = new web3.eth.Contract(config.CONTRACT_ABI, config.CONTRACT_ADDR);
  processLog(config.SRC_NAME, 'connectAndAccessContract(0)', contract._address);
  if (!contract._address) callback('Contract object error', null);
  else callback(null, contract);
};

// ------------------------------------------------------
// Utility Functions [inner]
//   processLog(srcFileName, funcName, message)
// ------------------------------------------------------
processLog = function (srcFileName, funcName, message) {
  //console.log(funcName + ': ' + util.inspect(message) + '\n');
  //if (util.inspect(message).search("Invalid JSON RPC response") == -1) return;

  var filePath = config.LOGFILE_DIR;
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }

  var nowDate = new Date();
  var timeFileName = nowDate.getFullYear() + "_" + (nowDate.getMonth() + 1) + "_" + nowDate.getDate();
  //+ "_" + nowDate.getHours() + "_" + nowDate.getMinutes();
  var logFileName = filePath + "log-" + timeFileName + "-" + srcFileName + ".log";
  var logMessage = "[" + nowDate + "] " + funcName + ": " + util.inspect(message) + '\n';
  //console.log(logMessage);

  fs.appendFileSync(logFileName, logMessage, function (error) {
    if (error) {
      console.log(error);
    }
  });
};
