import os
import logging
from typing import List

logger = logging.getLogger(__name__)

# To prevent loading model multiple times
_embedding_model = None

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        try:
            from pyannote.audio import Model
            hf_token = os.getenv("HF_TOKEN")
            logger.info("Loading pyannote/embedding model...")
            try:
                _embedding_model = Model.from_pretrained("pyannote/embedding", use_auth_token=hf_token)
            except TypeError:
                _embedding_model = Model.from_pretrained("pyannote/embedding", token=hf_token)
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            raise e
    return _embedding_model

def extract_voice_embedding(audio_path: str) -> List[float]:
    """
    Trích xuất đặc trưng giọng nói (512-d vector) từ file audio mẫu.
    """
    try:
        from pyannote.audio import Inference
        model = get_embedding_model()
        inference = Inference(model, window="whole")
        import soundfile as sf
        import torch
        data, sample_rate = sf.read(audio_path, dtype='float32')
        if len(data.shape) == 1:
            data = data.reshape(1, -1)
        else:
            data = data.T
        waveform = torch.from_numpy(data)
        embedding = inference({"waveform": waveform, "sample_rate": sample_rate})
        # embedding is a numpy array of shape (512,)
        return embedding.tolist()
    except Exception as e:
        logger.error(f"Error extracting embedding for {audio_path}: {e}")
        # Fallback for local testing without proper torch setup
        return [0.0] * 512

def compare_embeddings(emb1: List[float], emb2: List[float]) -> float:
    """
    Tính khoảng cách Cosine giữa 2 vector.
    Trở về giá trị 1.0 (Giống nhau hoàn toàn) đến -1.0 (Khác nhau hoàn toàn).
    """
    try:
        import numpy as np
        a = np.array(emb1)
        b = np.array(emb2)
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
    except Exception:
        return 0.0
