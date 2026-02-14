from fastapi import (
    FastAPI,
    HTTPException,
    Depends,
    WebSocket,
    WebSocketDisconnect,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
import asyncio
import hashlib
import os
import json
from datetime import datetime, timedelta
from contextlib import asynccontextmanager

# Services
from services.ipfs_service import IPFSStorageService, IPFSConfig
from services.polygon_id_service import PolygonIDService, Purpose as IDPurpose
from services.blockchain_service import (
    BlockchainService,
    ContractAddresses,
    Purpose,
    KeyRecoveryService,
)
from services.eeg_service import (
    EEGDataParser,
    EEGDataProcessor,
    EEGStreamBuffer,
    process_hex_stream,
    create_eeg_processor,
    create_eeg_parser,
)

# ==================== MODELS ====================


class DataPurpose(str, Enum):
    RESEARCH = "RESEARCH"
    MEDICAL = "MEDICAL"
    COMMERCIAL = "COMMERCIAL"
    PERSONAL = "PERSONAL"


class UploadRequest(BaseModel):
    data: str = Field(..., description="Base64 encoded EEG data")
    is_encrypted: bool = Field(True, description="Whether data is already encrypted")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)


class UploadResponse(BaseModel):
    ipfs_cid: str
    tx_hash: str
    data_hash: str
    timestamp: int


class ConsentRequest(BaseModel):
    researcher_did: str
    data_cid: str
    purpose: DataPurpose = DataPurpose.RESEARCH
    duration_days: int = Field(30, ge=1, le=365)


class ConsentResponse(BaseModel):
    consent_id: str
    tx_hash: str
    expires_at: int


class ConsentVerifyRequest(BaseModel):
    user_did: str
    researcher_did: str
    data_cid: str


class IdentityCreateRequest(BaseModel):
    user_id: str


class IdentityResponse(BaseModel):
    did: str
    public_key: str
    created_at: float


class GuardianRequest(BaseModel):
    guardian_address: str


class RecoveryRequest(BaseModel):
    new_key_hash: str


class DataQuery(BaseModel):
    cid: str
    user_did: str


class EEGHexData(BaseModel):
    hex_data: str = Field(..., description="Hexadecimal encoded EEG data block")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)


class EEGStreamRequest(BaseModel):
    session_id: str = Field(..., description="Session identifier")
    hex_data: str = Field(..., description="Hexadecimal encoded EEG data block")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)


class EEGProcessedData(BaseModel):
    channels: Dict[str, List[Dict[str, float]]]
    events: List[Dict[str, Any]]
    stress_level: str
    stats: Dict[str, Any]


# ==================== APP LIFETIME ====================


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Create shared EEG stream buffers
    app.state.eeg_buffers = {}

    yield

    # Cleanup
    app.state.eeg_buffers = {}


app = FastAPI(
    title="SAVY Neuro-Data Steward API",
    description="Privacy-preserving neural data management with blockchain consent",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== DEPENDENCIES ====================


def get_ipfs() -> IPFSStorageService:
    return IPFSStorageService()


def get_polygon_id() -> PolygonIDService:
    return PolygonIDService()


def get_blockchain() -> BlockchainService:
    rpc_url = os.getenv("POLYGON_RPC", "https://rpc-amoy.polygon.technology")
    private_key = os.getenv("PRIVATE_KEY", "")

    return BlockchainService(
        rpc_url,
        private_key,
        ContractAddresses(
            consent_manager=os.getenv("CONSENT_MANAGER_ADDR", ""),
            neuro_data_registry=os.getenv("NEURO_REGISTRY_ADDR", ""),
            key_recovery=os.getenv("KEY_RECOVERY_ADDR", ""),
        ),
    )


def get_eeg_processor() -> EEGDataProcessor:
    return create_eeg_processor()


def get_eeg_parser() -> EEGDataParser:
    return create_eeg_parser()


async def get_eeg_buffer(session_id: str) -> EEGStreamBuffer:
    if session_id not in app.state.eeg_buffers:
        app.state.eeg_buffers[session_id] = EEGStreamBuffer()
    return app.state.eeg_buffers[session_id]


# ==================== HEALTH ====================


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "SAVY Neuro-Data Steward",
        "buffer_count": len(getattr(app.state, "eeg_buffers", {})),
    }


@app.get("/")
async def root():
    return {"name": "SAVY Neuro-Data Steward API", "version": "0.1.0", "docs": "/docs"}


# ==================== IDENTITY ====================


@app.post("/api/v1/identity/create", response_model=IdentityResponse)
async def create_identity(
    request: IdentityCreateRequest,
    polygon_id: PolygonIDService = Depends(get_polygon_id),
):
    """Create a new decentralized identity (DID)"""
    identity = polygon_id.create_identity(request.user_id)
    print("Identity:", identity)
    print("Type created_at:", type(identity.get("created_at")))
    return IdentityResponse(
        did=identity["did"],
        public_key=identity["public_key"],
        created_at=float(identity["created_at"])
    )


@app.get("/api/v1/identity/{did}")
async def get_identity(
    did: str, polygon_id: PolygonIDService = Depends(get_polygon_id)
):
    """Get identity by DID"""
    identity = polygon_id.get_identity(did)
    if not identity:
        raise HTTPException(status_code=404, detail="Identity not found")
    return identity


# ==================== DATA UPLOAD ====================


@app.post("/api/v1/data/upload", response_model=UploadResponse)
async def upload_data(
    request: UploadRequest,
    ipfs: IPFSStorageService = Depends(get_ipfs),
    blockchain: BlockchainService = Depends(get_blockchain),
):
    """
    Upload encrypted neural data to IPFS and register on blockchain
    """
    import base64
    import time

    try:
        data_bytes = base64.b64decode(request.data)
        data_hash = hashlib.sha256(data_bytes).hexdigest()
        timestamp = int(time.time())

        async with ipfs as ipfs_client:
            metadata = {
                "timestamp": timestamp,
                "size": len(data_bytes),
                "is_encrypted": request.is_encrypted,
                **(request.metadata or {}),
            }
            ipfs_result = await ipfs_client.upload_encrypted(data_bytes, metadata)

        try:
            tx_hash = await blockchain.register_data(
                ipfs_cid=ipfs_result.cid,
                data_hash=data_hash,
                size=len(data_bytes),
                is_encrypted=request.is_encrypted,
            )
        except Exception as e:
            tx_hash = f"pending:{str(e)}"

        return UploadResponse(
            ipfs_cid=ipfs_result.cid,
            tx_hash=tx_hash,
            data_hash=data_hash,
            timestamp=timestamp,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/data/{cid}")
async def get_data(cid: str, ipfs: IPFSStorageService = Depends(get_ipfs)):
    """Retrieve data from IPFS"""
    try:
        async with ipfs as ipfs_client:
            data, metadata = await ipfs_client.retrieve_encrypted(cid)
            import base64

            return {
                "cid": cid,
                "data": base64.b64encode(data).decode(),
                "metadata": metadata,
            }
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/api/v1/data/{cid}/metadata")
async def get_data_metadata(cid: str, ipfs: IPFSStorageService = Depends(get_ipfs)):
    """Get data metadata from IPFS"""
    try:
        async with ipfs as ipfs_client:
            _, metadata = await ipfs_client.retrieve_encrypted(cid)
            return {"cid": cid, "metadata": metadata}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/api/v1/data/{cid}/gateway")
async def get_gateway_url(cid: str, ipfs: IPFSStorageService = Depends(get_ipfs)):
    """Get public gateway URL for CID"""
    async with ipfs as ipfs_client:
        url = await ipfs_client.get_gateway_url(cid)
        return {"cid": cid, "url": url}


# ==================== EEG PROCESSING ====================


@app.post("/api/v1/eeg/process", response_model=EEGProcessedData)
async def process_eeg_data(
    request: EEGHexData,
    processor: EEGDataProcessor = Depends(get_eeg_processor),
    parser: EEGDataParser = Depends(get_eeg_parser),
):
    """Process hexadecimal EEG data and return visualization-ready format"""
    try:
        samples, events = parser.hex_to_samples(request.hex_data)
        processed_samples = processor.preprocess_samples(samples)
        processed_data = processor.prepare_stream_data(processed_samples, events)

        return processed_data

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Processing failed: {str(e)}")


@app.post("/api/v1/eeg/stream/start")
async def start_eeg_stream(session_id: str):
    """Initialize new EEG stream session"""
    if session_id in app.state.eeg_buffers:
        raise HTTPException(status_code=409, detail="Session already active")

    app.state.eeg_buffers[session_id] = EEGStreamBuffer()
    return {"status": "active", "session_id": session_id}


@app.post("/api/v1/eeg/stream/stop")
async def stop_eeg_stream(session_id: str):
    """Stop EEG stream and clear buffer"""
    if session_id not in app.state.eeg_buffers:
        raise HTTPException(status_code=404, detail="Session not found")

    del app.state.eeg_buffers[session_id]
    return {"status": "stopped", "session_id": session_id}


@app.post("/api/v1/eeg/stream")
async def stream_eeg_data(
    request: EEGStreamRequest,
    buffer: EEGStreamBuffer = Depends(get_eeg_buffer),
):
    """
    Process and buffer EEG stream data for real-time visualization
    Returns processed data for display
    """
    try:
        processed_data = await process_hex_stream(request.hex_data, buffer)

        return {
            "status": "processed",
            "session_id": request.session_id,
            "data": processed_data,
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Processing failed: {str(e)}")


@app.get("/api/v1/eeg/stream/{session_id}/buffer")
async def get_stream_buffer(
    session_id: str,
    duration: float = 10.0,
    processor: EEGDataProcessor = Depends(get_eeg_processor),
):
    """Get buffered data from a specific stream session"""
    if session_id not in app.state.eeg_buffers:
        raise HTTPException(status_code=404, detail="Session not found")

    buffer = app.state.eeg_buffers[session_id]
    samples, events = await buffer.get_window(duration)

    processed_data = processor.prepare_stream_data(samples, events)

    return {
        "session_id": session_id,
        "buffer_size": len(samples),
        "data": processed_data,
    }


class ConnectionManager:
    """WebSocket connection manager for real-time EEG streaming"""

    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)

    def disconnect(self, websocket: WebSocket, session_id: str):
        if session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)

    async def broadcast(self, session_id: str, message: dict):
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"Send failed: {e}")
                    self.disconnect(connection, session_id)


manager = ConnectionManager()


@app.websocket("/ws/eeg/stream/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time EEG streaming"""
    await manager.connect(websocket, session_id)

    if session_id not in app.state.eeg_buffers:
        app.state.eeg_buffers[session_id] = EEGStreamBuffer()

    buffer = app.state.eeg_buffers[session_id]
    processor = create_eeg_processor()

    try:
        while True:
            # Wait for incoming data
            data = await websocket.receive_text()

            try:
                hex_data = json.loads(data).get("hex_data")
                if not hex_data:
                    continue

                # Process data
                samples, events = create_eeg_parser().hex_to_samples(hex_data)
                processed_samples = processor.preprocess_samples(samples)
                await buffer.add_data(processed_samples, events)

                # Send processed data back
                processed_data = processor.prepare_stream_data(
                    processed_samples, events
                )

                await manager.send_personal_message(
                    {"type": "data", "data": processed_data}, websocket
                )

            except Exception as e:
                await manager.send_personal_message(
                    {"type": "error", "error": str(e)}, websocket
                )

    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
        print(f"Client disconnected from session: {session_id}")

    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, session_id)


# ==================== CONSENT ====================


@app.post("/api/v1/consent/grant", response_model=ConsentResponse)
async def grant_consent(
    request: ConsentRequest,
    blockchain: BlockchainService = Depends(get_blockchain),
    polygon_id: PolygonIDService = Depends(get_polygon_id),
):
    """Grant consent for a researcher to access data"""
    try:
        purpose_map = {
            DataPurpose.RESEARCH: Purpose.RESEARCH,
            DataPurpose.MEDICAL: Purpose.MEDICAL,
            DataPurpose.COMMERCIAL: Purpose.COMMERCIAL,
            DataPurpose.PERSONAL: Purpose.PERSONAL,
        }
        purpose = purpose_map[request.purpose]

        tx_hash = await blockchain.grant_consent(
            researcher_address=request.researcher_did,
            data_cid=request.data_cid,
            purpose=purpose,
            duration_days=request.duration_days,
        )

        consent_id = hashlib.sha256(
            f"{request.researcher_did}:{request.data_cid}:{tx_hash}".encode()
        ).hexdigest()
        expires_at = int(datetime.utcnow().timestamp()) + (
            request.duration_days * 86400
        )

        return ConsentResponse(
            consent_id=consent_id, tx_hash=tx_hash, expires_at=expires_at
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/consent/verify")
async def verify_consent(
    request: ConsentVerifyRequest,
    blockchain: BlockchainService = Depends(get_blockchain),
    polygon_id: PolygonIDService = Depends(get_polygon_id),
):
    """Verify if consent is valid"""
    try:
        is_valid_blockchain = await blockchain.verify_consent(
            user_address=request.user_did,
            researcher_address=request.researcher_did,
            data_cid=request.data_cid,
        )

        is_valid_polygon_id = polygon_id.verify_consent(
            user_did=request.user_did,
            researcher_did=request.researcher_did,
            data_cid=request.data_cid,
        )

        return {
            "valid": is_valid_blockchain or is_valid_polygon_id,
            "blockchain": is_valid_blockchain,
            "polygon_id": is_valid_polygon_id,
        }

    except Exception as e:
        return {"valid": False, "error": str(e)}


@app.get("/api/v1/consent/list/{user_did}")
async def list_consents(
    user_did: str, blockchain: BlockchainService = Depends(get_blockchain)
):
    """List all consents for a user"""
    try:
        consents = await blockchain.get_user_consents(user_did)
        return {
            "user": user_did,
            "consents": [
                {
                    "researcher": c.researcher,
                    "data_cid": c.data_cid,
                    "purpose": Purpose(c.purpose).name,
                    "granted_at": c.granted_at,
                    "expires_at": c.expires_at,
                    "revoked": c.revoked,
                }
                for c in consents
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/v1/consent/{consent_id}")
async def revoke_consent(
    consent_id: str, blockchain: BlockchainService = Depends(get_blockchain)
):
    """Revoke consent"""
    try:
        tx_hash = await blockchain.revoke_consent(consent_id)
        return {"tx_hash": tx_hash, "revoked": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== KEY RECOVERY ====================


@app.post("/api/v1/key/guardian/add")
async def add_guardian(
    request: GuardianRequest, blockchain: BlockchainService = Depends(get_blockchain)
):
    """Add a recovery guardian"""
    try:
        from services.blockchain_service import KeyRecoveryService

        recovery = KeyRecoveryService(
            os.getenv("POLYGON_RPC", "https://rpc-amoy.polygon.technology"),
            os.getenv("PRIVATE_KEY", ""),
            os.getenv("KEY_RECOVERY_ADDR", ""),
        )
        tx_hash = await recovery.add_guardian(request.guardian_address)
        return {"tx_hash": tx_hash, "added": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/key/recover/initiate")
async def initiate_recovery(
    request: RecoveryRequest, blockchain: BlockchainService = Depends(get_blockchain)
):
    """Initiate key recovery"""
    try:
        from services.blockchain_service import KeyRecoveryService

        recovery = KeyRecoveryService(
            os.getenv("POLYGON_RPC", "https://rpc-amoy.polygon.technology"),
            os.getenv("PRIVATE_KEY", ""),
            os.getenv("KEY_RECOVERY_ADDR", ""),
        )
        tx_hash = await recovery.initiate_recovery(request.new_key_hash)
        return {"tx_hash": tx_hash, "initiated": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== STATS ====================


@app.get("/api/v1/stats")
async def get_stats(ipfs: IPFSStorageService = Depends(get_ipfs)):
    """Get system statistics"""
    try:
        async with ipfs as ipfs_client:
            stats = await ipfs_client.stats_repo()
            node_id = await ipfs_client.id()
            peers = await ipfs_client.swarm_peers()
            return {
                "ipfs": {
                    "repo_size": stats.get("RepoSize", 0),
                    "num_objects": stats.get("NumObjects", 0),
                    "peers": len(peers),
                },
                "node": node_id,
                "stream_sessions": len(getattr(app.state, "eeg_buffers", {})),
            }
    except Exception as e:
        return {"error": str(e)}


# ==================== RUN ====================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
