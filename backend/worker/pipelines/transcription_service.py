import os
import logging
from faster_whisper import WhisperModel

logger = logging.getLogger(__name__)

# Khởi tạo model Whisper một lần khi khởi động worker
# Sử dụng size "small" (hoặc "base") cho máy có 4GB VRAM
MODEL_SIZE = "small"
device = "cuda"
compute_type = "float16"

import torch

# Load model vào bộ nhớ
try:
    if torch.cuda.is_available():
        logger.info(f"Loading Whisper model '{MODEL_SIZE}' on cuda (float16)...")
        whisper_model = WhisperModel(MODEL_SIZE, device="cuda", compute_type="float16")
        logger.info("Whisper model loaded successfully on CUDA.")
    else:
        logger.info(f"CUDA not available. Loading Whisper model '{MODEL_SIZE}' on CPU (int8)...")
        whisper_model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
        logger.info("Whisper model loaded successfully on CPU.")
except Exception as e:
    logger.error(f"Failed to load Whisper model: {e}")
    whisper_model = None


def transcribe_audio(audio_path: str) -> list:
    """
    Sử dụng Faster-Whisper để nhận diện giọng nói và xuất ra văn bản tiếng Việt.
    Trả về danh sách các segment: [{"start": 0.0, "end": 2.5, "text": "Xin chào"}, ...]
    """
    if not whisper_model:
        raise RuntimeError("Whisper model is not initialized. Cannot transcribe.")
    
    logger.info(f"Starting transcription for {audio_path}...")
    
    # language="vi" ép model nhận diện tiếng Việt
    segments, info = whisper_model.transcribe(audio_path, language="vi", beam_size=5)
    
    logger.info(f"Detected language '{info.language}' with probability {info.language_probability}")
    
    transcripts = []
    for segment in segments:
        transcripts.append({
            "start": segment.start,
            "end": segment.end,
            "text": segment.text.strip()
        })
        
    logger.info(f"Transcription completed with {len(transcripts)} segments.")
    return transcripts
