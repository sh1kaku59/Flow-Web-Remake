import os
import subprocess
import logging

logger = logging.getLogger(__name__)

def preprocess_audio(input_path: str, output_path: str) -> str:
    """
    Chuẩn hóa âm thanh đầu vào về định dạng WAV, 16kHz, mono.
    Nếu không có ffmpeg/imageio_ffmpeg, trả về input_path trực tiếp.
    """
    logger.info(f"Preprocessing audio: {input_path}")
    
    ffmpeg_exe = "ffmpeg"
    try:
        import imageio_ffmpeg
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        pass
    
    command = [
        ffmpeg_exe,
        "-i", input_path,
        "-ac", "1",           # Mono channel
        "-ar", "16000",       # 16kHz sample rate
        "-y",                 # Ghi đè file nếu đã tồn tại
        output_path
    ]
    
    try:
        subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        logger.info(f"Successfully preprocessed audio to: {output_path}")
        return output_path
    except Exception as e:
        logger.warning(f"Audio preprocessing skipped or failed ({e}), returning original file.")
        return input_path
