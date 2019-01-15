const minimist = require('minimist');
var Web3 = require('web3');
var solc = require('solc');
var fs = require('fs');
var config = require('./config.json')
var args = minimist(process.argv.slice(1), {
    alias: {
        c: 'compile',
    }
});

web3 = new Web3(new Web3.providers.HttpProvider(config.ETHRPC_IP_PORT));

if (args.compile || !fs.existsSync('./DeployData/bytecode') || !fs.existsSync('./DeployData/abi.json')) {
    console.log('Contract compiling...');
    var source = fs.readFileSync('./AuditContract.sol', 'utf8');
    var output = solc.compile(source, 1);
    var ContractData = '0x' + output.contracts[':AuditContract'].bytecode;
    var ContractABI = output.contracts[':AuditContract'].interface;
    config.CONTRACT_BYTECODE = ContractData;
    config.CONTRACT_ABI = ContractABI;
    if (!fs.existsSync('./DeployData'))
        fs.mkdirSync('./DeployData');
    fs.writeFileSync('./DeployData/bytecode', ContractData);
    fs.writeFileSync('./DeployData/abi.json', ContractABI);
    ContractABI = JSON.parse(ContractABI);
} else {
    var ContractData = fs.readFileSync('./DeployData/bytecode');
    var ContractABI = JSON.parse(fs.readFileSync('./DeployData/abi.json'));
}

web3.eth.personal.unlockAccount(config.COINBASE_ACCOUNT, config.PASSPHRASE, 60)
    .then(function(result) {
        console.log('unlockAccount success');
        var Contract = new web3.eth.Contract(ContractABI);
        Contract.deploy({ data: ContractData }).send({
            from: config.COINBASE_ACCOUNT,
            gas: config.GAS,
            gasPrice: config.GAS_PRICE
        }).on('receipt', function(receipt) {
            console.log('receipt contractAddress:' + receipt.contractAddress)
            config.CONTRACT_ADDR = receipt.contractAddress;
            var config_string = JSON.stringify(config, null, 4);
            //replace \g  -> 
            //replace "[{ -> [{
            //replace }]" -> }]
            config_string = config_string.replace(/\\/g, "");
            config_string = config_string.replace(/\"\[\{/g, "\[\{");
            config_string = config_string.replace(/\}\]\"/g, "\}\]");
            fs.writeFileSync('./config.json', config_string, "utf8", (err) => {
                if (err) throw err;
                console.log('The config file has been saved!');
            });
        }).catch(function(error) {
            console.log('deploy fail, error: ' + error);
        })
    }).catch(function(error) {
        console.log('unlockAccount fail, error: ' + error);
    });