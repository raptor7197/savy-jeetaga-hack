import os
import asyncio
import json
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
from enum import Enum
from eth_typing import ChecksumAddress
from web3 import Web3
from web3.contract import Contract
from eth_account import Account


class Purpose(Enum):
    RESEARCH = 0
    MEDICAL = 1
    COMMERCIAL = 2
    PERSONAL = 3


@dataclass
class ContractAddresses:
    consent_manager: str
    neuro_data_registry: str
    key_recovery: str


@dataclass
class ConsentInfo:
    consent_id: str
    user: str
    researcher: str
    data_cid: str
    purpose: int
    granted_at: int
    expires_at: int
    revoked: bool


@dataclass
class DataRecord:
    record_id: str
    ipfs_cid: str
    owner: str
    data_hash: str
    size: int
    created_at: int
    is_encrypted: bool


class BlockchainService:
    """
    Layer 2: Polygon Blockchain Service
    Handles consent management and data registration on Polygon
    """

    def __init__(
        self, rpc_url: str, private_key: str, contract_addresses: ContractAddresses
    ):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.account = Account.from_key(private_key)
        self.contract_addresses = contract_addresses
        self.consent_contract: Optional[Contract] = None
        self.registry_contract: Optional[Contract] = None
        self.recovery_contract: Optional[Contract] = None

        self._load_contracts()

    def _load_contracts(self):
        """Load smart contracts using ABI"""

        # Consent Manager ABI (minimal for demo)
        consent_abi = [
            {
                "inputs": [
                    {"name": "_researcher", "type": "address"},
                    {"name": "_dataCID", "type": "string"},
                    {"name": "_purpose", "type": "uint8"},
                    {"name": "_durationDays", "type": "uint256"},
                    {"name": "_signature", "type": "bytes"},
                ],
                "name": "grantConsent",
                "outputs": [{"name": "", "type": "bytes32"}],
                "stateMutability": "nonpayable",
                "type": "function",
            },
            {
                "inputs": [
                    {"name": "_user", "type": "address"},
                    {"name": "_researcher", "type": "address"},
                    {"name": "_dataCID", "type": "string"},
                ],
                "name": "verifyConsent",
                "outputs": [{"name": "", "type": "bool"}],
                "stateMutability": "view",
                "type": "function",
            },
            {
                "inputs": [{"name": "_consentId", "type": "bytes32"}],
                "name": "revokeConsent",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
            },
            {
                "inputs": [{"name": "_user", "type": "address"}],
                "name": "getUserConsents",
                "outputs": [
                    {
                        "components": [
                            {"name": "user", "type": "address"},
                            {"name": "researcher", "type": "address"},
                            {"name": "dataCID", "type": "string"},
                            {"name": "purpose", "type": "uint8"},
                            {"name": "grantedAt", "type": "uint256"},
                            {"name": "expiresAt", "type": "uint256"},
                            {"name": "revoked", "type": "bool"},
                            {"name": "signature", "type": "bytes"},
                        ],
                        "name": "",
                        "type": "tuple[]",
                    }
                ],
                "stateMutability": "view",
                "type": "function",
            },
        ]

        # Data Registry ABI
        registry_abi = [
            {
                "inputs": [
                    {"name": "_ipfsCID", "type": "string"},
                    {"name": "_dataHash", "type": "bytes32"},
                    {"name": "_size", "type": "uint256"},
                    {"name": "_isEncrypted", "type": "bool"},
                    {"name": "_encryptionAlgorithm", "type": "string"},
                    {"name": "_metadata", "type": "tuple"},
                ],
                "name": "registerData",
                "outputs": [{"name": "", "type": "bytes32"}],
                "stateMutability": "nonpayable",
                "type": "function",
            },
            {
                "inputs": [{"name": "_recordId", "type": "bytes32"}],
                "name": "getDataRecord",
                "outputs": [
                    {
                        "components": [
                            {"name": "ipfsCID", "type": "string"},
                            {"name": "owner", "type": "address"},
                            {"name": "dataHash", "type": "bytes32"},
                            {"name": "size", "type": "uint256"},
                            {"name": "createdAt", "type": "uint256"},
                            {"name": "updatedAt", "type": "uint256"},
                            {"name": "isEncrypted", "type": "bool"},
                            {"name": "encryptionAlgorithm", "type": "string"},
                        ],
                        "name": "",
                        "type": "tuple",
                    }
                ],
                "stateMutability": "view",
                "type": "function",
            },
            {
                "inputs": [
                    {"name": "_ipfsCID", "type": "string"},
                    {"name": "_providedHash", "type": "bytes32"},
                ],
                "name": "verifyDataIntegrity",
                "outputs": [{"name": "", "type": "bool"}],
                "stateMutability": "view",
                "type": "function",
            },
        ]

        # Load contracts
        self.consent_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(self.contract_addresses.consent_manager),
            abi=consent_abi,
        )

        self.registry_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(
                self.contract_addresses.neuro_data_registry
            ),
            abi=registry_abi,
        )

    async def grant_consent(
        self,
        researcher_address: str,
        data_cid: str,
        purpose: Purpose,
        duration_days: int,
    ) -> str:
        """Grant consent for a researcher to access data"""

        tx = self.consent_contract.functions.grantConsent(
            Web3.to_checksum_address(researcher_address),
            data_cid,
            purpose.value,
            duration_days,
            b"",
        ).build_transaction(
            {
                "chainId": self.w3.eth.chain_id,
                "gas": 300000,
                "gasPrice": self.w3.eth.gas_price,
                "nonce": self.w3.eth.get_transaction_count(self.account.address),
            }
        )

        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)

        return tx_hash.hex()

    async def verify_consent(
        self, user_address: str, researcher_address: str, data_cid: str
    ) -> bool:
        """Verify if consent is valid"""

        return self.consent_contract.functions.verifyConsent(
            Web3.to_checksum_address(user_address),
            Web3.to_checksum_address(researcher_address),
            data_cid,
        ).call()

    async def revoke_consent(self, consent_id: str) -> str:
        """Revoke consent"""

        tx = self.consent_contract.functions.revokeConsent(
            bytes.fromhex(consent_id.replace("0x", ""))
        ).build_transaction(
            {
                "chainId": self.w3.eth.chain_id,
                "gas": 100000,
                "gasPrice": self.w3.eth.gas_price,
                "nonce": self.w3.eth.get_transaction_count(self.account.address),
            }
        )

        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)

        return tx_hash.hex()

    async def get_user_consents(self, user_address: str) -> List[ConsentInfo]:
        """Get all consents for a user"""

        consents = self.consent_contract.functions.getUserConsents(
            Web3.to_checksum_address(user_address)
        ).call()

        return [
            ConsentInfo(
                consent_id="",
                user=c[0],
                researcher=c[1],
                data_cid=c[2],
                purpose=c[3],
                granted_at=c[4],
                expires_at=c[5],
                revoked=c[6],
            )
            for c in consents
        ]

    async def register_data(
        self,
        ipfs_cid: str,
        data_hash: str,
        size: int,
        is_encrypted: bool = True,
        encryption_algorithm: str = "AES-256-GCM",
    ) -> str:
        """Register neural data on blockchain"""

        metadata = (
            "",  # sessionId
            256,  # sampleRate
            4,  # channelCount
            0,  # duration
            "float32",  # format
        )

        tx = self.registry_contract.functions.registerData(
            ipfs_cid,
            bytes.fromhex(data_hash.replace("0x", "")),
            size,
            is_encrypted,
            encryption_algorithm,
            metadata,
        ).build_transaction(
            {
                "chainId": self.w3.eth.chain_id,
                "gas": 500000,
                "gasPrice": self.w3.eth.gas_price,
                "nonce": self.w3.eth.get_transaction_count(self.account.address),
            }
        )

        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)

        return tx_hash.hex()

    async def verify_data_integrity(self, ipfs_cid: str, data_hash: str) -> bool:
        """Verify data integrity"""

        return self.registry_contract.functions.verifyDataIntegrity(
            ipfs_cid, bytes.fromhex(data_hash.replace("0x", ""))
        ).call()

    def get_balance(self) -> str:
        """Get wallet balance"""
        balance = self.w3.eth.get_balance(self.account.address)
        return self.w3.from_wei(balance, "ether")


class KeyRecoveryService:
    """
    Layer 2: 3-of-5 Multi-signature Key Recovery
    """

    def __init__(self, rpc_url: str, private_key: str, contract_address: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.account = Account.from_key(private_key)
        self.contract_address = Web3.to_checksum_address(contract_address)
        self._load_contract()

    def _load_contract(self):
        abi = [
            {
                "inputs": [{"name": "_guardian", "type": "address"}],
                "name": "addGuardian",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
            },
            {
                "inputs": [{"name": "_guardian", "type": "address"}],
                "name": "removeGuardian",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
            },
            {
                "inputs": [{"name": "_newKeyHash", "type": "bytes32"}],
                "name": "initiateRecovery",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
            },
            {
                "inputs": [
                    {"name": "_requestId", "type": "bytes32"},
                    {"name": "_shareHash", "type": "bytes32"},
                ],
                "name": "approveRecovery",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
            },
            {
                "inputs": [{"name": "_requestId", "type": "bytes32"}],
                "name": "executeRecovery",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
            },
            {
                "inputs": [{"name": "_user", "type": "address"}],
                "name": "getGuardianCount",
                "outputs": [{"name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function",
            },
        ]

        self.contract = self.w3.eth.contract(address=self.contract_address, abi=abi)

    async def add_guardian(self, guardian_address: str) -> str:
        """Add a recovery guardian"""

        tx = self.contract.functions.addGuardian(
            Web3.to_checksum_address(guardian_address)
        ).build_transaction(
            {
                "chainId": self.w3.eth.chain_id,
                "gas": 100000,
                "gasPrice": self.w3.eth.gas_price,
                "nonce": self.w3.eth.get_transaction_count(self.account.address),
            }
        )

        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        return tx_hash.hex()

    async def initiate_recovery(self, new_key_hash: str) -> str:
        """Initiate key recovery"""

        tx = self.contract.functions.initiateRecovery(
            bytes.fromhex(new_key_hash.replace("0x", ""))
        ).build_transaction(
            {
                "chainId": self.w3.eth.chain_id,
                "gas": 200000,
                "gasPrice": self.w3.eth.gas_price,
                "nonce": self.w3.eth.get_transaction_count(self.account.address),
            }
        )

        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        return tx_hash.hex()

    async def approve_recovery(self, request_id: str, share_hash: str) -> str:
        """Approve recovery with guardian share"""

        tx = self.contract.functions.approveRecovery(
            bytes.fromhex(request_id.replace("0x", "")),
            bytes.fromhex(share_hash.replace("0x", "")),
        ).build_transaction(
            {
                "chainId": self.w3.eth.chain_id,
                "gas": 150000,
                "gasPrice": self.w3.eth.gas_price,
                "nonce": self.w3.eth.get_transaction_count(self.account.address),
            }
        )

        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        return tx_hash.hex()


# Quick initialization
def create_blockchain_service() -> BlockchainService:
    """Create blockchain service from environment"""

    rpc_url = os.getenv("POLYGON_RPC", "https://rpc-amoy.polygon.technology")
    private_key = os.getenv("PRIVATE_KEY", "")

    contract_addresses = ContractAddresses(
        consent_manager=os.getenv("CONSENT_MANAGER_ADDR", ""),
        neuro_data_registry=os.getenv("NEURO_REGISTRY_ADDR", ""),
        key_recovery=os.getenv("KEY_RECOVERY_ADDR", ""),
    )

    return BlockchainService(rpc_url, private_key, contract_addresses)
