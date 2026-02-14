// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NeuroDataRegistry is AccessControl, ReentrancyGuard {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    struct DataRecord {
        string ipfsCID;
        address owner;
        bytes32 dataHash;
        uint256 size;
        uint256 createdAt;
        uint256 updatedAt;
        bool isEncrypted;
        string encryptionAlgorithm;
    }

    struct DataMetadata {
        string sessionId;
        uint256 sampleRate;
        uint256 channelCount;
        uint256 duration;
        string format;
    }

    mapping(bytes32 => DataRecord) public dataRecords;
    mapping(address => bytes32[]) public ownerDataList;
    mapping(string => bytes32) public cidToRecord;

    uint256 public recordCount;

    event DataRegistered(
        bytes32 indexed recordId,
        address indexed owner,
        string ipfsCID,
        bytes32 dataHash
    );

    event DataUpdated(
        bytes32 indexed recordId,
        string newIPFSCID,
        uint256 updatedAt
    );

    event DataDeleted(
        bytes32 indexed recordId,
        address indexed owner,
        uint256 deletedAt
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REGISTRAR_ROLE, msg.sender);
    }

    function registerData(
        string calldata _ipfsCID,
        bytes32 _dataHash,
        uint256 _size,
        bool _isEncrypted,
        string calldata _encryptionAlgorithm,
        DataMetadata calldata _metadata
    ) external nonReentrant returns (bytes32) {
        require(bytes(_ipfsCID).length > 0, "Invalid IPFS CID");
        require(_dataHash != bytes32(0), "Invalid data hash");
        require(_size > 0, "Invalid size");

        bytes32 recordId = keccak256(abi.encodePacked(
            msg.sender,
            _ipfsCID,
            block.timestamp,
            recordCount++
        ));

        DataRecord storage record = dataRecords[recordId];
        record.ipfsCID = _ipfsCID;
        record.owner = msg.sender;
        record.dataHash = _dataHash;
        record.size = _size;
        record.createdAt = block.timestamp;
        record.updatedAt = block.timestamp;
        record.isEncrypted = _isEncrypted;
        record.encryptionAlgorithm = _encryptionAlgorithm;

        cidToRecord[_ipfsCID] = recordId;
        ownerDataList[msg.sender].push(recordId);

        emit DataRegistered(recordId, msg.sender, _ipfsCID, _dataHash);

        return recordId;
    }

    function updateDataCID(bytes32 _recordId, string calldata _newIPFSCID)
        external
        returns (bytes32)
    {
        DataRecord storage record = dataRecords[_recordId];
        require(record.owner == msg.sender, "Not the owner");
        require(bytes(_newIPFSCID).length > 0, "Invalid new CID");

        record.ipfsCID = _newIPFSCID;
        record.updatedAt = block.timestamp;

        cidToRecord[_newIPFSCID] = _recordId;

        emit DataUpdated(_recordId, _newIPFSCID, block.timestamp);

        return _recordId;
    }

    function deleteData(bytes32 _recordId) external {
        DataRecord storage record = dataRecords[_recordId];
        require(record.owner == msg.sender, "Not the owner");

        emit DataDeleted(_recordId, msg.sender, block.timestamp);

        delete dataRecords[_recordId];
        delete cidToRecord[record.ipfsCID];
    }

    function getDataRecord(bytes32 _recordId) external view returns (DataRecord memory) {
        return dataRecords[_recordId];
    }

    function getRecordByCID(string calldata _ipfsCID) external view returns (DataRecord memory) {
        bytes32 recordId = cidToRecord[_ipfsCID];
        return dataRecords[recordId];
    }

    function verifyDataIntegrity(string calldata _ipfsCID, bytes32 _providedHash)
        external
        view
        returns (bool)
    {
        bytes32 recordId = cidToRecord[_ipfsCID];
        DataRecord memory record = dataRecords[recordId];
        return record.dataHash == _providedHash;
    }

    function getOwnerDataCount(address _owner) external view returns (uint256) {
        return ownerDataList[_owner].length;
    }

    function getOwnerDataRecords(address _owner)
        external
        view
        returns (DataRecord[] memory)
    {
        bytes32[] memory recordIds = ownerDataList[_owner];
        DataRecord[] memory records = new DataRecord[](recordIds.length);

        for (uint256 i = 0; i < recordIds.length; i++) {
            records[i] = dataRecords[recordIds[i]];
        }

        return records;
    }
}
