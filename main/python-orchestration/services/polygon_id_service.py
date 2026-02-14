import os
import json
import hashlib
import asyncio
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
from enum import Enum


class Purpose(Enum):
    RESEARCH = 0
    MEDICAL = 1
    COMMERCIAL = 2
    PERSONAL = 3


@dataclass
class IdentityClaim:
    """Represents a verifiable claim about an identity"""

    claim_id: str
    issuer: str
    subject: str
    claim_type: str
    data: Dict[str, Any]
    issued_at: int
    expires_at: Optional[int] = None


@dataclass
class AuthProof:
    """Zero-knowledge proof for authentication"""

    proof: str
    public_signals: List[str]
    challenge: str


class PolygonIDService:
    """
    Layer 2: Polygon ID / DID Service
    Handles self-sovereign identity and anonymous authentication
    """

    def __init__(self):
        self.identities: Dict[str, Dict] = {}
        self.claims: Dict[str, IdentityClaim] = {}
        self.sessions: Dict[str, Dict] = {}
        self._challenge_counter = 0

    def create_identity(
        self, user_id: str, seed: Optional[bytes] = None
    ) -> Dict[str, str]:
        """
        Create a new decentralized identity (DID)
        In production: Use Polygon ID SDK
        """
        if seed is None:
            import secrets

            seed = secrets.token_bytes(32)

        # Generate DID (simplified - real implementation uses BBS+ signatures)
        did = f"did:polygonid:{user_id}"

        # Generate key pair (simplified)
        private_key = hashlib.sha256(seed).digest()
        public_key = hashlib.sha256(private_key).digest()

        identity = {
            "did": did,
            "user_id": user_id,
            "public_key": public_key.hex(),
            "created_at": asyncio.get_event_loop().time(),
        }

        self.identities[did] = identity

        return identity

    def get_identity(self, did: str) -> Optional[Dict]:
        """Get identity by DID"""
        return self.identities.get(did)

    def issue_claim(
        self,
        issuer_did: str,
        subject_did: str,
        claim_type: str,
        data: Dict[str, Any],
        duration_days: int = 365,
    ) -> IdentityClaim:
        """Issue a verifiable credential"""
        import secrets

        claim_id = secrets.token_hex(16)

        claim = IdentityClaim(
            claim_id=claim_id,
            issuer=issuer_did,
            subject=subject_did,
            claim_type=claim_type,
            data=data,
            issued_at=int(asyncio.get_event_loop().time()),
            expires_at=int(asyncio.get_event_loop().time()) + (duration_days * 86400),
        )

        self.claims[claim_id] = claim

        return claim

    def get_claims(self, did: str) -> List[IdentityClaim]:
        """Get all claims for an identity"""
        return [c for c in self.claims.values() if c.subject == did]

    def create_auth_challenge(self, did: str) -> str:
        """Create authentication challenge"""
        self._challenge_counter += 1
        challenge = hashlib.sha256(
            f"{did}:{self._challenge_counter}:{asyncio.get_event_loop().time()}".encode()
        ).hexdigest()

        self.sessions[challenge] = {
            "did": did,
            "created_at": int(asyncio.get_event_loop().time()),
            "used": False,
        }

        return challenge

    def verify_auth_proof(self, proof: AuthProof) -> bool:
        """Verify authentication proof (ZK proof)"""
        # In production: Verify the actual ZK proof using Polygon ID SDK
        # This is a simplified verification

        if proof.challenge not in self.sessions:
            return False

        session = self.sessions[proof.challenge]
        if session.get("used"):
            return False

        # Mark session as used
        session["used"] = True

        return True

    def revoke_claim(self, claim_id: str, issuer_did: str) -> bool:
        """Revoke a claim"""
        if claim_id not in self.claims:
            return False

        claim = self.claims[claim_id]
        if claim.issuer != issuer_did:
            return False

        # Mark as revoked (in production, update on-chain)
        claim.expires_at = int(asyncio.get_event_loop().time())

        return True

    def create_consent_claim(
        self,
        user_did: str,
        data_cid: str,
        researcher_did: str,
        purpose: Purpose,
        duration_days: int,
    ) -> IdentityClaim:
        """Create a consent credential"""
        data = {
            "data_cid": data_cid,
            "researcher_did": researcher_did,
            "purpose": purpose.name,
            "allowed": True,
        }

        return self.issue_claim(
            issuer_did=user_did,
            subject_did=researcher_did,
            claim_type="consent",
            data=data,
            duration_days=duration_days,
        )

    def verify_consent(self, user_did: str, researcher_did: str, data_cid: str) -> bool:
        """Verify consent is valid"""
        user_claims = self.get_claims(user_did)

        for claim in user_claims:
            if (
                claim.claim_type == "consent"
                and claim.data.get("researcher_did") == researcher_did
                and claim.data.get("data_cid") == data_cid
                and claim.data.get("allowed") is True
            ):
                # Check expiration
                if (
                    claim.expires_at
                    and int(asyncio.get_event_loop().time()) < claim.expires_at
                ):
                    return True

        return False

    def create_age_proof(self, did: str, age: int) -> AuthProof:
        """Create ZK proof of age without revealing exact age"""
        challenge = self.create_auth_challenge(did)

        # Simplified - in production use actual ZK proof
        proof_data = hashlib.sha256(f"{did}:{age}:{challenge}".encode()).hexdigest()

        return AuthProof(
            proof=proof_data,
            public_signals=[str(age >= 18)],  # Only reveal if over 18
            challenge=challenge,
        )

    def get_did_from_address(self, eth_address: str) -> Optional[str]:
        """Get DID from Ethereum address"""
        for did, identity in self.identities.items():
            if identity.get("eth_address", "").lower() == eth_address.lower():
                return did
        return None


class ZKProofService:
    """
    Zero-Knowledge Proof service for anonymous verification
    """

    def __init__(self):
        self.circuits: Dict[str, Dict] = {}

    async def generate_consent_proof(
        self, data_cid: str, consent_record: Dict, private_inputs: Dict
    ) -> AuthProof:
        """
        Generate ZK proof for consent verification
        In production: Use Noir + Barretenberg
        """
        # Create challenge
        challenge = hashlib.sha256(
            f"{data_cid}:{consent_record.get('expiry')}:{asyncio.get_event_loop().time()}".encode()
        ).hexdigest()

        # Simplified proof generation
        # In production: Compile Noir circuit and generate actual proof
        proof_data = hashlib.sha256(
            f"{private_inputs.get('secret')}:{challenge}".encode()
        ).hexdigest()

        return AuthProof(
            proof=proof_data,
            public_signals=[data_cid, str(consent_record.get("expiry", 0))],
            challenge=challenge,
        )

    async def verify_consent_proof(
        self, proof: AuthProof, data_cid: str, expected_expiry: int
    ) -> bool:
        """Verify ZK proof for consent"""
        # Simplified verification
        # In production: Use SnarkJS to verify actual proof

        if proof.public_signals[0] != data_cid:
            return False

        if int(proof.public_signals[1]) < expected_expiry:
            return False

        return True

    async def generate_range_proof(
        self, value: int, min_value: int, max_value: int
    ) -> str:
        """Generate ZK proof that value is in range"""
        # Simplified
        proof = hashlib.sha256(f"{value}:{min_value}:{max_value}".encode()).hexdigest()
        return proof

    async def verify_range_proof(
        self, proof: str, min_value: int, max_value: int
    ) -> bool:
        """Verify range proof"""
        # Simplified
        return True


# Convenience functions
async def create_user_identity(user_id: str) -> Dict[str, str]:
    """Quick identity creation"""
    service = PolygonIDService()
    return service.create_identity(user_id)


async def grant_consent(
    user_did: str,
    data_cid: str,
    researcher_did: str,
    purpose: Purpose = Purpose.RESEARCH,
    duration_days: int = 30,
) -> IdentityClaim:
    """Quick consent granting"""
    service = PolygonIDService()
    return service.create_consent_claim(
        user_did, data_cid, researcher_did, purpose, duration_days
    )
