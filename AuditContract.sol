pragma solidity ^0.4.21;

contract AuditContract {

    // to store the owners' address  
    mapping(address => bool) public isOwner;

    // to store the audit data 
    mapping(string => string) auditDataList;

    //to store the audit keys
    mapping(uint => string) AuditKeyList;

    // to record the audit data count
    uint public dataCount;
  
    // the constructor for assigning the contract issuer to be one of the owners
    constructor() public{
        isOwner[msg.sender] = true;
    }  

    // for adding a new owner of the contract
    function addNewOwner(address _addr) public {
        // this operation should be triggered by one of the contract owners
        require(isOwner[msg.sender]);
        isOwner[_addr] = true;
    }

    // insert an audit data and store the audit key
    function insertAuditData(string _key, string _data) public {
        // this operation should be triggered by one of the contract owners
        require(isOwner[msg.sender]);
        auditDataList[_key] = _data;
        AuditKeyList[dataCount] = _key;
        dataCount++;
    }

    // get the audit data by key
    function getAuditData(string _key) external view returns(string) {
        return auditDataList[_key];
    }

    // get the audit data count
    function getAuditDataCount() external view returns(uint) {
        return dataCount;
    }

    //get the audit key by index
    function getAuditKey(uint _num) external view returns(string){
        return AuditKeyList[_num];
    }

    // check the address is owner or not
    function checkIsOwner(address _addr) external view returns(bool){
        return isOwner[_addr];
    }
}