import os
from dotenv import load_dotenv
import logging
from pyannote.audio import Pipeline

logging.basicConfig(level=logging.INFO)

load_dotenv()
token = os.getenv("HF_TOKEN")
print(f"Token loaded: {bool(token)}")

try:
    pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1", token=token)
    print("Successfully loaded!")
except Exception as e:
    print(f"Exception: {e}")
