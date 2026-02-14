import asyncio
import json
import hashlib
import os
from typing import Optional, Dict, Any, List
from dataclasses import dataclass, asdict
import aiohttp
import base64


@dataclass
class IPFSMetadata:
    cid: str
    encryption_algorithm: str
    original_size: int
    encrypted_size: int
    timestamp: int
    checksum: str
    content_type: str = "application/octet-stream"


@dataclass
class IPFSConfig:
    host: str = "127.0.0.1"
    port: int = 5001
    gateway_port: int = 8080
    use_https: bool = False


class IPFSStorageService:
    """
    Layer 2: IPFS Storage with encryption
    Handles upload/download of encrypted neural data to IPFS
    """

    def __init__(self, config: Optional[IPFSConfig] = None):
        self.config = config or IPFSConfig()
        self._session: Optional[aiohttp.ClientSession] = None
        self.base_url = f"http://{self.config.host}:{self.config.port}"
        self.gateway_url = f"http://{self.config.host}:{self.config.gateway_port}"

    async def __aenter__(self) -> "IPFSStorageService":
        self._session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, *args):
        if self._session:
            await self._session.close()

    async def _post(self, endpoint: str, data: Any = None, params: Dict = None) -> Dict:
        """Make POST request to IPFS API"""
        url = f"{self.base_url}/api/v0{endpoint}"

        async with self._session.post(url, data=data, params=params) as resp:
            if resp.status != 200:
                text = await resp.text()
                raise Exception(f"IPFS error {resp.status}: {text}")
            return await resp.json()

    async def _get(self, endpoint: str, params: Dict = None) -> Any:
        """Make GET request to IPFS API"""
        url = f"{self.base_url}/api/v0{endpoint}"

        async with self._session.get(url, params=params) as resp:
            if resp.status != 200:
                text = await resp.text()
                raise Exception(f"IPFS error {resp.status}: {text}")
            return await resp.json()

    async def add_bytes(self, data: bytes, pin: bool = True) -> str:
        """Add raw bytes to IPFS"""
        params = {"pin": str(pin).lower()}

        form = aiohttp.FormData()
        form.add_field(
            "file", data, filename="data.bin", content_type="application/octet-stream"
        )

        result = await self._post("/add", data=form, params=params)
        return result["Hash"]

    async def add_json(self, data: Dict, pin: bool = True) -> str:
        """Add JSON to IPFS"""
        json_str = json.dumps(data)
        return await self.add_bytes(json_str.encode("utf-8"), pin=pin)

    async def add_file(self, file_path: str, pin: bool = True) -> str:
        """Add file to IPFS"""
        with open(file_path, "rb") as f:
            data = f.read()
        return await self.add_bytes(data, pin=pin)

    async def cat(self, cid: str) -> bytes:
        """Get data from IPFS by CID"""
        result = await self._get("/cat", params={"arg": cid})
        if isinstance(result, bytes):
            return result
        return result.encode("utf-8")

    async def cat_json(self, cid: str) -> Dict:
        """Get JSON from IPFS"""
        data = await self.cat(cid)
        return json.loads(data.decode("utf-8"))

    async def pin_add(self, cid: str) -> bool:
        """Pin CID for persistence"""
        result = await self._post("/pin/add", params={"arg": cid})
        return result.get("Pins", [cid]) == [cid]

    async def pin_rm(self, cid: str) -> bool:
        """Unpin CID"""
        result = await self._post("/pin/rm", params={"arg": cid})
        return True

    async def ls(self, cid: str) -> List[Dict]:
        """List directory contents"""
        result = await self._get("/ls", params={"arg": cid})
        return result.get("Objects", [{}])[0].get("Links", [])

    async def refs(self, cid: str) -> List[str]:
        """Get references to a CID"""
        result = await self._get("/refs", params={"arg": cid})
        return [ref["Ref"] for ref in result.get("Refs", [])]

    async def dag_get(self, cid: str) -> Dict:
        """Get DAG node"""
        result = await self._get("/dag/get", params={"arg": cid})
        return result

    async def dag_put(self, data: Dict) -> str:
        """Put DAG node"""
        json_data = json.dumps(data)
        result = await self._post("/dag/put", data=json_data.encode("utf-8"))
        return result["Cid"]["/"]

    async def block_put(self, data: bytes) -> str:
        """Put block directly"""
        form = aiohttp.FormData()
        form.add_field("file", data, filename="block.data")
        result = await self._post("/block/put", data=form)
        return result["Key"]

    async def block_get(self, cid: str) -> bytes:
        """Get block directly"""
        return await self.cat(cid)

    async def stats_repo(self) -> Dict:
        """Get repository stats"""
        return await self._get("/stats/repo")

    async def id(self) -> Dict:
        """Get node ID"""
        return await self._get("/id")

    async def bootstrap_list(self) -> List[str]:
        """List bootstrap peers"""
        result = await self._get("/bootstrap/list")
        return result.get("Peers", [])

    async def swarm_peers(self) -> List[Dict]:
        """List connected peers"""
        result = await self._get("/swarm/peers")
        return result.get("Peers", [])

    async def upload_encrypted(
        self, encrypted_data: bytes, metadata: Dict
    ) -> IPFSMetadata:
        """Upload encrypted neural data with metadata"""
        # Create data package
        data_package = {
            "metadata": metadata,
            "data": base64.b64encode(encrypted_data).decode("utf-8"),
        }

        # Add to IPFS
        cid = await self.add_json(data_package, pin=True)

        # Calculate checksums
        data_checksum = hashlib.sha256(encrypted_data).hexdigest()

        return IPFSMetadata(
            cid=cid,
            encryption_algorithm="AES-256-GCM",
            original_size=metadata.get("original_size", 0),
            encrypted_size=len(encrypted_data),
            timestamp=metadata.get("timestamp", 0),
            checksum=data_checksum,
        )

    async def retrieve_encrypted(self, cid: str) -> tuple[bytes, Dict]:
        """Retrieve and decrypt data from IPFS"""
        data_package = await self.cat_json(cid)

        encrypted_bytes = base64.b64decode(data_package["data"])
        metadata = data_package["metadata"]

        return encrypted_bytes, metadata

    async def get_gateway_url(self, cid: str) -> str:
        """Get public gateway URL for CID"""
        return f"{self.gateway_url}/ipfs/{cid}"


class FilecoinStorageService(IPFSStorageService):
    """Extended IPFS service with Filecoin persistence"""

    def __init__(self, config: Optional[IPFSConfig] = None):
        super().__init__(config)
        self.deal_status: Dict[str, Any] = {}

    async def store_with_filecoin(self, cid: str, duration_days: int = 180) -> Dict:
        """
        Store CID on Filecoin (requires Powergate/API)
        This is a placeholder - integrate with Filecoin API
        """
        # Placeholder - integrate with Filecoin Lotus node or Powergate
        deal_info = {
            "cid": cid,
            "deal_cid": f"deal_{cid[:8]}",
            "duration_days": duration_days,
            "status": "proposed",
            "timestamp": int(asyncio.get_event_loop().time()),
        }

        self.deal_status[cid] = deal_info
        return deal_info

    async def get_deal_status(self, cid: str) -> Optional[Dict]:
        """Get Filecoin deal status"""
        return self.deal_status.get(cid)


# Convenience function for quick usage
async def quick_upload(data: bytes, metadata: Dict) -> IPFSMetadata:
    """Quick upload function"""
    async with IPFSStorageService() as ipfs:
        return await ipfs.upload_encrypted(data, metadata)


async def quick_download(cid: str) -> tuple[bytes, Dict]:
    """Quick download function"""
    async with IPFSStorageService() as ipfs:
        return await ipfs.retrieve_encrypted(cid)
