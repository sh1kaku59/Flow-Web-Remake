import os
import logging

try:
    import torch
    from pyannote.audio import Pipeline
    HAS_PYANNOTE = True
except Exception as _e:
    HAS_PYANNOTE = False
    torch = None
    Pipeline = None

logger = logging.getLogger(__name__)

# Tải HF_TOKEN từ biến môi trường
diarization_pipeline = None
def init_diarization():
    global diarization_pipeline
    HF_TOKEN = os.getenv("HF_TOKEN")
    if not HF_TOKEN:
        logger.warning("HF_TOKEN is not set. Diarization will not be available.")
        return
        
    try:
        logger.info("Loading Pyannote Diarization Pipeline...")
        # Pyannote/HuggingFace Hub changed the parameter from use_auth_token to token in newer versions
        try:
            pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1", use_auth_token=HF_TOKEN)
        except TypeError:
            pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1", token=HF_TOKEN)
        
        # Chuyển sang GPU nếu có
        if torch.cuda.is_available():
            pipeline.to(torch.device("cuda"))
            logger.info("Pyannote pipeline moved to GPU (CUDA).")
            
        diarization_pipeline = pipeline
        logger.info("Pyannote Diarization Pipeline loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load Pyannote Pipeline: {e}")

def diarize_audio(audio_path: str) -> list:
    """
    Sử dụng Pyannote để phân tách giọng nói.
    Trả về danh sách các segment: [{"start": 0.0, "end": 2.5, "speaker": "SPEAKER_00"}, ...]
    """
    global diarization_pipeline
    if HAS_PYANNOTE and not diarization_pipeline:
        init_diarization()
        
    if not HAS_PYANNOTE or not diarization_pipeline:
        logger.warning("Pyannote pipeline not available, returning single default speaker segment.")
        return [{"start": 0.0, "end": 60.0, "speaker": "SPEAKER_00"}]
        
    logger.info(f"Starting diarization for {audio_path}...")
    
    try:
        import soundfile as sf
        import torch
        data, sample_rate = sf.read(audio_path, dtype='float32')
        if len(data.shape) == 1:
            data = data.reshape(1, -1)
        else:
            data = data.T
        waveform = torch.from_numpy(data)
        diarization_output = diarization_pipeline({"waveform": waveform, "sample_rate": sample_rate})
    except Exception as e:
        logger.error(f"Diarization inference error ({e}), returning default segment.")
        return [{"start": 0.0, "end": 60.0, "speaker": "SPEAKER_00"}]
    
    if hasattr(diarization_output, "speaker_diarization"):
        diarization = diarization_output.speaker_diarization
    else:
        diarization = diarization_output
        
    speaker_segments = []
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        speaker_segments.append({
            "start": turn.start,
            "end": turn.end,
            "speaker": speaker
        })
        
    logger.info(f"Diarization completed with {len(speaker_segments)} segments.")
    return speaker_segments
