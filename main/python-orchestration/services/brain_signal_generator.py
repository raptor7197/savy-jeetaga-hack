import random
import time
import asyncio
import logging
from typing import List

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def generate_random_hex_code(length: int = 64) -> str:
    """Generate a random hexadecimal code of specified length"""
    hex_chars = "0123456789ABCDEF"
    return "".join(random.choice(hex_chars) for _ in range(length))


async def simulate_external_server_connection() -> str:
    """Simulate connecting to an external server to get brain signal data"""
    # Simulate network latency
    await asyncio.sleep(random.uniform(0.1, 0.5))

    # Generate random hex brain signal data
    hex_code = generate_random_hex_code()
    return hex_code


async def continuous_signal_generator():
    """Continuously generate and print brain signals to terminal"""
    logger.info("Starting brain signal receiver...")
    logger.info("Simulating connection to external EEG server...")
    logger.info("=" * 80)

    try:
        while True:
            # Get brain signal data
            hex_data = await simulate_external_server_connection()

            # Print the received data
            logger.info(f"Brain Signal Received: {hex_data}")

            # Wait for next signal
            await asyncio.sleep(random.uniform(0.5, 2.0))

    except KeyboardInterrupt:
        logger.info("\nStopping brain signal receiver...")
        logger.info("Connection to external server closed")
    except Exception as e:
        logger.error(f"Error: {e}")


def main():
    """Main function to start the brain signal receiver"""
    logger.info("Brain Signal Monitoring System")
    logger.info("Version: 1.0.0")
    logger.info("Author: Savy EEG")
    logger.info("=" * 80)

    try:
        asyncio.run(continuous_signal_generator())
    except KeyboardInterrupt:
        logger.info("\nProgram terminated by user")
    except Exception as e:
        logger.error(f"Fatal error: {e}")


if __name__ == "__main__":
    main()
