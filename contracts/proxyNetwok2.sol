// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./proxyNetwork.sol";


contract MyContractV2 is MyContractV1 {
 
    function setNewValue(uint256 _newValue) public onlyOwner {
        value = _newValue;
    }
}
