// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DrugSupplyChain {
    struct Batch {
        string name;
        string description;
        uint256 mfgDate;
        uint256 expDate;
        address owner;
    }

    mapping(uint256 => Batch) public batches;
    uint256 public batchCount = 0;

    // 🔹 ADD THIS EVENT
    event BatchCreated(uint256 batchId, string name, address indexed owner);

    function createBatch(
        string memory _name,
        string memory _desc,
        uint256 _mfgDate,
        uint256 _expDate
    ) public {
        // Store batch
        batches[batchCount] = Batch(_name, _desc, _mfgDate, _expDate, msg.sender);

        // 🔹 Emit event with new batch ID, name, and owner
        emit BatchCreated(batchCount, _name, msg.sender);

        // Increment batch counter
        batchCount++;
    }

    function transferBatch(uint256 _batchId, address _to) public {
        require(msg.sender == batches[_batchId].owner, "Not owner");
        batches[_batchId].owner = _to;
    }
}
