// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ConsentManager is AccessControl, ReentrancyGuard {
    using ECDSA for bytes32;

    bytes32 public constant DATA_PROVIDER_ROLE = keccak256("DATA_PROVIDER_ROLE");
    bytes32 public constant RESEARCHER_ROLE = keccak256("RESEARCHER_ROLE");
    bytes32 public constant STEWARD_ROLE = keccak256("STEWARD_ROLE");

    enum Purpose {
        RESEARCH,
        MEDICAL,
        COMMERCIAL,
        PERSONAL
    }

    struct Consent {
        address user;
        address researcher;
        string dataCID;
        Purpose purpose;
        uint256 grantedAt;
        uint256 expiresAt;
        bool revoked;
        bytes signature;
    }

    struct AccessLog {
        string dataCID;
        address researcher;
        uint256 timestamp;
        bool consentValid;
    }

    mapping(bytes32 => Consent) public consents;
    mapping(address => string[]) public userDataList;
    mapping(string => address[]) public dataAccessList;
    mapping(bytes32 => AccessLog[]) public accessLogs;

    uint256 public consentCount;

    event ConsentGranted(
        bytes32 indexed consentId,
        address indexed user,
        address indexed researcher,
        string dataCID,
        Purpose purpose,
        uint256 expiresAt
    );

    event ConsentRevoked(bytes32 indexed consentId);
    event DataAccessRecorded(
        string indexed dataCID,
        address indexed researcher,
        uint256 timestamp,
        bool consentValid
    );

    modifier onlyValidConsent(bytes32 consentId) {
        require(consents[consentId].user != address(0), "Consent does not exist");
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DATA_PROVIDER_ROLE, msg.sender);
    }

    function grantConsent(
        address _researcher,
        string calldata _dataCID,
        Purpose _purpose,
        uint256 _durationDays,
        bytes calldata _signature
    ) external nonReentrant returns (bytes32) {
        require(_researcher != address(0), "Invalid researcher address");
        require(_durationDays > 0 && _durationDays <= 365, "Invalid duration");
        require(bytes(_dataCID).length > 0, "Invalid data CID");

        bytes32 consentId = keccak256(abi.encodePacked(
            msg.sender,
            _researcher,
            _dataCID,
            block.timestamp,
            consentCount++
        ));

        uint256 expiresAt = block.timestamp + (_durationDays * 1 days);

        Consent storage consent = consents[consentId];
        consent.user = msg.sender;
        consent.researcher = _researcher;
        consent.dataCID = _dataCID;
        consent.purpose = _purpose;
        consent.grantedAt = block.timestamp;
        consent.expiresAt = expiresAt;
        consent.signature = _signature;

        userDataList[msg.sender].push(_dataCID);
        dataAccessList[_dataCID].push(_researcher);

        emit ConsentGranted(consentId, msg.sender, _researcher, _dataCID, _purpose, expiresAt);

        return consentId;
    }

    function verifyConsent(
        address _user,
        address _researcher,
        string calldata _dataCID
    ) external view returns (bool) {
        bytes32 consentId = _getConsentId(_user, _researcher, _dataCID);
        Consent memory consent = consents[consentId];

        return (
            consent.user == _user &&
            consent.researcher == _researcher &&
            block.timestamp < consent.expiresAt &&
            !consent.revoked
        );
    }

    function verifyConsentWithPurpose(
        address _user,
        address _researcher,
        string calldata _dataCID,
        Purpose _purpose
    ) external view returns (bool) {
        bytes32 consentId = _getConsentId(_user, _researcher, _dataCID);
        Consent memory consent = consents[consentId];

        return (
            consent.user == _user &&
            consent.researcher == _researcher &&
            consent.purpose == _purpose &&
            block.timestamp < consent.expiresAt &&
            !consent.revoked
        );
    }

    function revokeConsent(bytes32 _consentId)
        external
        onlyValidConsent(_consentId)
    {
        require(consents[_consentId].user == msg.sender, "Not the consent owner");
        consents[_consentId].revoked = true;
        emit ConsentRevoked(_consentId);
    }

    function recordAccess(
        string calldata _dataCID,
        address _researcher,
        bool _consentValid
    ) external onlyRole(RESEARCHER_ROLE) {
        accessLogs[_getDataKey(_dataCID)].push(AccessLog({
            dataCID: _dataCID,
            researcher: _researcher,
            timestamp: block.timestamp,
            consentValid: _consentValid
        }));

        emit DataAccessRecorded(_dataCID, _researcher, block.timestamp, _consentValid);
    }

    function getUserConsents(address _user) external view returns (Consent[] memory) {
        string[] memory dataCIDs = userDataList[_user];
        Consent[] memory result = new Consent[](dataCIDs.length);

        for (uint256 i = 0; i < dataCIDs.length; i++) {
            bytes32 consentId = _getConsentId(_user, dataAccessList[dataCIDs[i]][0], dataCIDs[i]);
            result[i] = consents[consentId];
        }

        return result;
    }

    function getDataAccessList(string calldata _dataCID) external view returns (address[] memory) {
        return dataAccessList[_dataCID];
    }

    function getAccessLogs(string calldata _dataCID) external view returns (AccessLog[] memory) {
        return accessLogs[_getDataKey(_dataCID)];
    }

    function _getConsentId(address _user, address _researcher, string calldata _dataCID)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_user, _researcher, _dataCID, 0));
    }

    function _getDataKey(string calldata _dataCID) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_dataCID));
    }
}
