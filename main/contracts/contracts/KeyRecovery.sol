// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract KeyRecovery is AccessControl, ReentrancyGuard {
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");

    struct Guardian {
        address wallet;
        bool isActive;
        uint256 addedAt;
    }

    struct RecoveryRequest {
        address user;
        bytes32 newKeyHash;
        uint256 requestTime;
        uint256 executeAfter;
        uint256 approvalCount;
        bool executed;
        bool cancelled;
    }

    struct KeyShare {
        bytes32 shareHash;
        address guardian;
        bool submitted;
    }

    mapping(address => Guardian[]) public userGuardians;
    mapping(bytes32 => RecoveryRequest) public recoveryRequests;
    mapping(bytes32 => KeyShare[]) public recoveryShares;
    mapping(address => bytes32[]) public userRecoveryRequests;

    uint256 public constant RECOVERY_DELAY = 2 days;
    uint256 public constant GUARDIAN_THRESHOLD = 3;
    uint256 public constant MAX_GUARDIANS = 5;

    event GuardianAdded(address indexed user, address guardian, uint256 totalGuardians);
    event GuardianRemoved(address indexed user, address guardian);
    event RecoveryRequested(
        bytes32 indexed requestId,
        address indexed user,
        bytes32 newKeyHash,
        uint256 executeAfter
    );
    event GuardianApproved(bytes32 indexed requestId, address guardian, uint256 approvalCount);
    event RecoveryExecuted(bytes32 indexed requestId, address indexed user);
    event RecoveryCancelled(bytes32 indexed requestId);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function addGuardian(address _guardian) external {
        require(_guardian != address(0), "Invalid guardian address");
        require(_guardian != msg.sender, "Cannot add self as guardian");

        Guardian[] storage guardians = userGuardians[msg.sender];
        require(guardians.length < MAX_GUARDIANS, "Max guardians reached");

        for (uint256 i = 0; i < guardians.length; i++) {
            require(guardians[i].wallet != _guardian, "Guardian already added");
        }

        guardians.push(Guardian({
            wallet: _guardian,
            isActive: true,
            addedAt: block.timestamp
        }));

        emit GuardianAdded(msg.sender, _guardian, guardians.length);
    }

    function removeGuardian(address _guardian) external {
        Guardian[] storage guardians = userGuardians[msg.sender];
        require(guardians.length > 0, "No guardians");

        bool found = false;
        for (uint256 i = 0; i < guardians.length; i++) {
            if (guardians[i].wallet == _guardian) {
                guardians[i].isActive = false;
                found = true;
                break;
            }
        }

        require(found, "Guardian not found");
        emit GuardianRemoved(msg.sender, _guardian);
    }

    function getGuardianCount(address _user) external view returns (uint256) {
        uint256 count = 0;
        Guardian[] storage guardians = userGuardians[_user];
        for (uint256 i = 0; i < guardians.length; i++) {
            if (guardians[i].isActive) {
                count++;
            }
        }
        return count;
    }

    function getActiveGuardians(address _user) external view returns (address[] memory) {
        Guardian[] storage guardians = userGuardians[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < guardians.length; i++) {
            if (guardians[i].isActive) {
                activeCount++;
            }
        }

        address[] memory result = new address[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < guardians.length; i++) {
            if (guardians[i].isActive) {
                result[index++] = guardians[i].wallet;
            }
        }

        return result;
    }

    function initiateRecovery(bytes32 _newKeyHash) external {
        require(_newKeyHash != bytes32(0), "Invalid key hash");

        Guardian[] storage guardians = userGuardians[msg.sender];
        uint256 activeCount = 0;
        for (uint256 i = 0; i < guardians.length; i++) {
            if (guardians[i].isActive) {
                activeCount++;
            }
        }

        require(activeCount >= GUARDIAN_THRESHOLD, "Not enough guardians");

        bytes32 requestId = keccak256(abi.encodePacked(
            msg.sender,
            _newKeyHash,
            block.timestamp
        ));

        recoveryRequests[requestId] = RecoveryRequest({
            user: msg.sender,
            newKeyHash: _newKeyHash,
            requestTime: block.timestamp,
            executeAfter: block.timestamp + RECOVERY_DELAY,
            approvalCount: 0,
            executed: false,
            cancelled: false
        });

        userRecoveryRequests[msg.sender].push(requestId);

        emit RecoveryRequested(requestId, msg.sender, _newKeyHash, block.timestamp + RECOVERY_DELAY);
    }

    function approveRecovery(bytes32 _requestId, bytes32 _shareHash) external {
        RecoveryRequest storage request = recoveryRequests[_requestId];
        require(request.user != address(0), "Request does not exist");
        require(!request.executed, "Already executed");
        require(!request.cancelled, "Request cancelled");
        require(block.timestamp < request.executeAfter, "Recovery window expired");

        Guardian[] storage guardians = userGuardians[request.user];
        bool isGuardian = false;
        for (uint256 i = 0; i < guardians.length; i++) {
            if (guardians[i].wallet == msg.sender && guardians[i].isActive) {
                isGuardian = true;
                break;
            }
        }

        require(isGuardian, "Not a guardian");

        KeyShare[] storage shares = recoveryShares[_requestId];
        for (uint256 i = 0; i < shares.length; i++) {
            require(shares[i].guardian != msg.sender, "Already approved");
        }

        shares.push(KeyShare({
            shareHash: _shareHash,
            guardian: msg.sender,
            submitted: true
        }));

        request.approvalCount++;

        emit GuardianApproved(_requestId, msg.sender, request.approvalCount);

        if (request.approvalCount >= GUARDIAN_THRESHOLD) {
            request.executeAfter = block.timestamp + 1;
        }
    }

    function executeRecovery(bytes32 _requestId) external nonReentrant {
        RecoveryRequest storage request = recoveryRequests[_requestId];
        require(request.user != address(0), "Request does not exist");
        require(!request.executed, "Already executed");
        require(!request.cancelled, "Request cancelled");
        require(block.timestamp >= request.executeAfter, "Too early");
        require(request.approvalCount >= GUARDIAN_THRESHOLD, "Not enough approvals");

        request.executed = true;

        emit RecoveryExecuted(_requestId, request.user);
    }

    function cancelRecovery(bytes32 _requestId) external {
        RecoveryRequest storage request = recoveryRequests[_requestId];
        require(request.user == msg.sender, "Not the user");
        require(!request.executed, "Already executed");
        require(!request.cancelled, "Already cancelled");

        request.cancelled = true;

        emit RecoveryCancelled(_requestId);
    }

    function getRecoveryShareCount(bytes32 _requestId) external view returns (uint256) {
        return recoveryShares[_requestId].length;
    }

    function getUserRecoveryRequests(address _user) external view returns (bytes32[] memory) {
        return userRecoveryRequests[_user];
    }
}
