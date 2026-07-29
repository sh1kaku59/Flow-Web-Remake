import os
import subprocess
import logging

logger = logging.getLogger(__name__)

def preprocess_audio(input_path: str, output_path: str) -> str:
    """
    Chuẩn hóa âm thanh đầu vào về định dạng WAV, 16kHz, mono.
    Đây là định dạng tối ưu nhất để đưa vào Whisper và Pyannote.
    """
    logger.info(f"Preprocessing audio: {input_path}")
    
    import imageio_ffmpeg
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
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
    except subprocess.CalledProcessError as e:
        logger.error(f"FFmpeg failed: {e}")
        raise Exception(f"Failed to preprocess audio: {str(e)}")
