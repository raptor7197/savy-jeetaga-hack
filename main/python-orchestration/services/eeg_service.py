import struct
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import asyncio
import json
import hashlib
import logging

logger = logging.getLogger(__name__)


class EEGChannel(Enum):
    FP1 = 0
    FP2 = 1
    C3 = 2
    C4 = 3


class EEGDataType(Enum):
    RAW = 0
    FILTERED = 1
    SPECTRAL = 2


@dataclass
class EEGSample:
    timestamp: float
    channel: EEGChannel
    value: float
    is_valid: bool = True


@dataclass
class EEGEvent:
    timestamp: float
    event_type: str
    channel: Optional[EEGChannel] = None
    duration: float = 0.0
    metadata: Dict[str, Any] = None


@dataclass
class EEGSessionMetadata:
    sampling_rate: int = 256
    num_channels: int = 4
    session_id: str = ""
    patient_id: str = ""
    start_time: float = 0.0
    filters_applied: List[str] = None


class EEGDataParser:
    """
    Parser for hexadecimal EEG data format
    Handles conversion from raw hex data to structured EEG samples
    """

    def __init__(self, sampling_rate: int = 256, num_channels: int = 4):
        self.sampling_rate = sampling_rate
        self.num_channels = num_channels
        self.byte_order = "<"  # Little endian
        self.value_format = "f"  # Float32

        self.channel_map = {
            0: EEGChannel.FP1,
            1: EEGChannel.FP2,
            2: EEGChannel.C3,
            3: EEGChannel.C4,
        }

    def hex_to_samples(self, hex_data: str) -> Tuple[List[EEGSample], List[EEGEvent]]:
        """
        Parse hexadecimal EEG data string to samples and events

        Hex format structure:
        [Header][Data][Events][Footer]
        Header: 32 bytes - metadata
        Data: (n_samples * n_channels * 4 bytes/float) bytes
        Events: variable length JSON encoded events
        Footer: 16 bytes - checksum
        """
        samples = []
        events = []

        try:
            # Convert hex string to bytes
            raw_bytes = bytes.fromhex(hex_data)

            # Validate header
            if len(raw_bytes) < 48:
                raise ValueError("Data too short")

            # Parse header
            header = raw_bytes[:32]
            metadata = self._parse_header(header)

            # Parse data section
            data_start = 32
            data_length = metadata["total_samples"] * metadata["channels"] * 4
            data_bytes = raw_bytes[data_start : data_start + data_length]

            samples = self._parse_data(data_bytes, metadata)

            # Parse events
            event_start = data_start + data_length
            events_length = int.from_bytes(
                raw_bytes[event_start : event_start + 4], "little"
            )
            event_data = raw_bytes[event_start + 4 : event_start + 4 + events_length]

            events = self._parse_events(event_data)

            # Validate checksum
            footer_start = event_start + 4 + events_length
            checksum = raw_bytes[footer_start : footer_start + 16]

            if not self._validate_checksum(raw_bytes[:footer_start], checksum):
                logger.warning("Checksum validation failed")

        except Exception as e:
            logger.error(f"Parsing failed: {e}")

        return samples, events

    def _parse_header(self, header: bytes) -> Dict[str, Any]:
        """Parse metadata header"""
        magic = header[:4].decode("ascii", errors="ignore")

        return {
            "magic": magic,
            "version": int.from_bytes(header[4:6], "little"),
            "channels": int.from_bytes(header[6:7], "little"),
            "total_samples": int.from_bytes(header[7:11], "little"),
            "sampling_rate": int.from_bytes(header[11:13], "little"),
            "start_timestamp": struct.unpack("d", header[13:21])[0],
            "session_id": header[21:32].decode("ascii", errors="ignore").strip(),
        }

    def _parse_data(
        self, data_bytes: bytes, metadata: Dict[str, Any]
    ) -> List[EEGSample]:
        """Parse EEG data samples"""
        samples = []
        sample_size = 4  # float32

        for i in range(metadata["total_samples"]):
            for channel_idx in range(metadata["channels"]):
                offset = (
                    i * metadata["channels"] * sample_size + channel_idx * sample_size
                )
                value = struct.unpack_from(
                    f"{self.byte_order}{self.value_format}", data_bytes, offset
                )[0]

                samples.append(
                    EEGSample(
                        timestamp=metadata["start_timestamp"]
                        + (i / metadata["sampling_rate"]),
                        channel=self.channel_map.get(channel_idx, EEGChannel.FP1),
                        value=value,
                    )
                )

        return samples

    def _parse_events(self, event_bytes: bytes) -> List[EEGEvent]:
        """Parse event markers from JSON data"""
        events = []

        try:
            event_data = json.loads(event_bytes.decode("utf-8"))

            for event in event_data.get("events", []):
                events.append(
                    EEGEvent(
                        timestamp=event.get("timestamp"),
                        event_type=event.get("type"),
                        channel=self.channel_map.get(event.get("channel"))
                        if event.get("channel") is not None
                        else None,
                        duration=event.get("duration", 0.0),
                        metadata=event.get("metadata", {}),
                    )
                )

        except Exception as e:
            logger.error(f"Event parsing failed: {e}")

        return events

    def _validate_checksum(self, data_bytes: bytes, checksum_bytes: bytes) -> bool:
        """Validate data integrity with SHA-1 checksum"""
        expected_checksum = hashlib.sha1(data_bytes).digest()
        return checksum_bytes == expected_checksum


class EEGDataProcessor:
    """
    Processes raw EEG data for visualization and analysis
    """

    def __init__(self, sampling_rate: int = 256, num_channels: int = 4):
        self.sampling_rate = sampling_rate
        self.num_channels = num_channels

        # Filter parameters
        self.filter_params = {
            "low_cutoff": 0.5,
            "high_cutoff": 40.0,
            "notch_freq": 50.0,
        }

        # Spike detection thresholds
        self.spike_threshold = 3.0
        self.spike_duration = 0.1

        # Stress level detection
        self.stress_bands = {
            "alpha": [8, 13],
            "beta": [13, 30],
            "theta": [4, 8],
            "delta": [0.5, 4],
        }

    def preprocess_samples(self, samples: List[EEGSample]) -> List[EEGSample]:
        """Preprocess raw EEG data"""
        processed = []

        for sample in samples:
            # Basic validation
            if abs(sample.value) > 10000:
                sample.is_valid = False

            processed.append(sample)

        return processed

    def detect_spikes(
        self, samples: List[EEGSample], channel: EEGChannel
    ) -> List[EEGEvent]:
        """Detect EEG spikes in specific channel"""
        spikes = []
        channel_samples = [s for s in samples if s.channel == channel and s.is_valid]

        if not channel_samples:
            return spikes

        # Calculate baseline stats
        values = np.array([s.value for s in channel_samples])
        mean = np.mean(values)
        std = np.std(values)

        # Spike detection
        threshold = mean + self.spike_threshold * std
        in_spike = False
        spike_start = None

        for i, sample in enumerate(channel_samples):
            if sample.value > threshold:
                if not in_spike:
                    spike_start = sample.timestamp
                    in_spike = True
            else:
                if in_spike:
                    duration = sample.timestamp - spike_start
                    if duration >= self.spike_duration:
                        spikes.append(
                            EEGEvent(
                                timestamp=spike_start,
                                event_type="spike",
                                channel=channel,
                                duration=duration,
                                metadata={
                                    "amplitude": max(
                                        [
                                            s.value
                                            for s in channel_samples[i - 2 : i + 2]
                                        ]
                                    ),
                                    "threshold": threshold,
                                },
                            )
                        )
                    in_spike = False

        return spikes

    def detect_stress_level(self, samples: List[EEGSample]) -> str:
        """Detect stress level from spectral features"""
        # Calculate PSD using FFT
        data = np.array([s.value for s in samples])
        fft_data = np.fft.fft(data)
        freqs = np.fft.fftfreq(len(data), 1 / self.sampling_rate)

        # Calculate band powers
        band_powers = {}
        total_power = 0

        for band, (low, high) in self.stress_bands.items():
            band_indices = np.where((freqs >= low) & (freqs <= high))[0]
            band_power = np.sum(np.abs(fft_data[band_indices]) ** 2)
            band_powers[band] = band_power
            total_power += band_power

        if total_power == 0:
            return "low"

        # Normalize
        band_powers = {k: v / total_power for k, v in band_powers.items()}

        # Stress level determination (based on beta/alpha ratio)
        beta_alpha_ratio = band_powers.get("beta", 0) / (
            band_powers.get("alpha", 1e-10)
        )

        if beta_alpha_ratio > 1.5:
            return "high"
        elif beta_alpha_ratio > 0.8:
            return "medium"
        else:
            return "low"

    def get_spectral_data(
        self, samples: List[EEGSample], channel: EEGChannel, window_size: int = 256
    ):
        """Get spectral data for visualization"""
        channel_samples = np.array(
            [s.value for s in samples if s.channel == channel and s.is_valid]
        )

        if len(channel_samples) < window_size:
            return {"frequencies": [], "power": []}

        # Calculate PSD using Welch's method
        from scipy.signal import welch

        try:
            freqs, power = welch(
                channel_samples, self.sampling_rate, nperseg=window_size
            )

            return {"frequencies": freqs.tolist(), "power": power.tolist()}

        except Exception as e:
            logger.error(f"PSD calculation failed: {e}")
            return {"frequencies": [], "power": []}

    def prepare_stream_data(
        self, samples: List[EEGSample], events: List[EEGEvent]
    ) -> Dict[str, Any]:
        """Prepare data for frontend streaming"""
        # Group samples by channel
        channel_data = {"fp1": [], "fp2": [], "c3": [], "c4": []}

        for sample in samples:
            if not sample.is_valid:
                continue

            channel_key = sample.channel.name.lower()
            channel_data[channel_key].append(
                {"timestamp": sample.timestamp, "value": sample.value}
            )

        # Detect spikes and stress
        spikes = []
        for channel in EEGChannel:
            spikes.extend(self.detect_spikes(samples, channel))

        stress_level = self.detect_stress_level(samples)

        return {
            "channels": channel_data,
            "events": [
                {
                    "timestamp": e.timestamp,
                    "type": e.event_type,
                    "channel": e.channel.name.lower() if e.channel else None,
                    "duration": e.duration,
                    "metadata": e.metadata,
                }
                for e in events + spikes
            ],
            "stress_level": stress_level,
            "stats": self._calculate_stats(samples),
        }

    def _calculate_stats(self, samples: List[EEGSample]) -> Dict[str, Any]:
        """Calculate statistical metrics"""
        valid_samples = [s for s in samples if s.is_valid]

        if not valid_samples:
            return {"total_samples": 0, "valid_samples": 0, "invalid_samples": 0}

        values = np.array([s.value for s in valid_samples])

        return {
            "total_samples": len(samples),
            "valid_samples": len(valid_samples),
            "invalid_samples": len(samples) - len(valid_samples),
            "mean": float(np.mean(values)),
            "std": float(np.std(values)),
            "min": float(np.min(values)),
            "max": float(np.max(values)),
        }


class EEGStreamBuffer:
    """
    Circular buffer for managing streaming EEG data
    """

    def __init__(self, max_samples: int = 10000):
        self.max_samples = max_samples
        self.samples = []
        self.events = []
        self.lock = asyncio.Lock()

    async def add_data(self, samples: List[EEGSample], events: List[EEGEvent]):
        """Add new data to buffer"""
        async with self.lock:
            self.samples.extend(samples)
            self.events.extend(events)

            # Trim to max samples
            if len(self.samples) > self.max_samples:
                self.samples = self.samples[-self.max_samples :]

            # Remove old events
            cutoff_time = self.samples[0].timestamp
            self.events = [e for e in self.events if e.timestamp >= cutoff_time]

    async def get_window(
        self, duration: float = 10.0
    ) -> Tuple[List[EEGSample], List[EEGEvent]]:
        """Get data from last N seconds"""
        async with self.lock:
            if not self.samples:
                return [], []

            end_time = self.samples[-1].timestamp
            start_time = end_time - duration

            window_samples = [s for s in self.samples if s.timestamp >= start_time]
            window_events = [
                e
                for e in self.events
                if e.timestamp >= start_time and e.timestamp <= end_time
            ]

            return window_samples, window_events

    async def clear(self):
        """Clear buffer"""
        async with self.lock:
            self.samples = []
            self.events = []


def create_eeg_processor() -> EEGDataProcessor:
    """Factory function for EEG processor"""
    return EEGDataProcessor()


def create_eeg_parser() -> EEGDataParser:
    """Factory function for EEG parser"""
    return EEGDataParser()


async def process_hex_stream(
    hex_data: str, buffer: Optional[EEGStreamBuffer] = None
) -> Dict[str, Any]:
    """Process hex EEG data and return processed results"""
    parser = create_eeg_parser()
    processor = create_eeg_processor()

    samples, events = parser.hex_to_samples(hex_data)
    processed_samples = processor.preprocess_samples(samples)

    if buffer:
        await buffer.add_data(processed_samples, events)

    return processor.prepare_stream_data(processed_samples, events)
