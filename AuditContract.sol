pragma solidity ^0.4.21;

contract AuditContract {

    // to store and check whether the address is the owner
    mapping(address => bool) public isOwner;

    // to store the audit data 
    mapping(string => string) auditDataList;

    // to store the audit keys
    mapping(uint => string) auditKeyList;

    // to check whether the key exists
    mapping(string => bool) keyExist;

    // to record the audit data count
    uint public dataCount;
  
    // the constructor for assigning the contract issuer to be one of the owners
    function AuditContract() public {
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
        if (!keyExist[_key]) {
            keyExist[_key] = true;
            auditKeyList[dataCount] = _key;
            dataCount++;
        }
    }

    // get the audit data by key
    function getAuditData(string _key) external view returns(string) {
        return auditDataList[_key];
    }

    // get the audit data count
    function getAuditDataCount() external view returns(uint) {
        return dataCount;
    }

    // get the audit key by index
    function getAuditKey(uint _index) external view returns(string) {
        return auditKeyList[_index];
    }

    // check the address is owner or not
    function checkIsOwner(address _addr) external view returns(bool) {
        return isOwner[_addr];
    }

}