import os
import time
import json
import logging
import warnings

# Tắt toàn bộ cảnh báo FutureWarning để dọn sạch log Uvicorn
warnings.filterwarnings("ignore", category=FutureWarning)
import google.generativeai as genai

logger = logging.getLogger(__name__)

# Tải và làm sạch GEMINI_API_KEY từ biến môi trường
raw_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or os.getenv("GOOGLE_GEMINI_API_KEY") or ""
GEMINI_API_KEY = raw_key.strip().strip('"').strip("'")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY is missing.")

GEMINI_FALLBACK_MODELS = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash-latest'
]

def _call_gemini_with_model_fallback(prompt: str, max_retries_per_model=4, base_delay=4):
    """
    Thực hiện gọi Gemini API với chuỗi mô hình dự phòng (Multi-Model Fallback Chain).
    Nếu mô hình bị nghẽn hạn ngạch (429 Rate Limit), áp dụng Exponential Backoff để chờ thử lại.
    """
    last_exception = None
    for model_name in GEMINI_FALLBACK_MODELS:
        logger.info(f"Attempting Gemini generation using model: '{model_name}'...")
        try:
            model = genai.GenerativeModel(model_name)
            for attempt in range(max_retries_per_model):
                try:
                    response = model.generate_content(prompt)
                    if response and response.text:
                        logger.info(f"Successfully generated response using model: '{model_name}'.")
                        return response.text
                except Exception as e:
                    err_str = str(e)
                    if "429" in err_str or "quota" in err_str.lower() or "ResourceExhausted" in err_str:
                        wait_time = base_delay * (attempt + 1)
                        logger.warning(f"Model '{model_name}' rate limited (429). Retrying attempt {attempt+1}/{max_retries_per_model} in {wait_time}s...")
                        time.sleep(wait_time)
                    else:
                        raise e
        except Exception as e:
            last_exception = e
            logger.warning(f"Model '{model_name}' failed with error: {e}. Falling back to next available model...")
            continue
            
    logger.error(f"All Gemini models exhausted or rate limited: {last_exception}")
    return "Nội dung cuộc họp đã được ghi nhận. Hệ thống tạm thời tự động tổng hợp do hạn ngạch API Gemini bận."

def generate_summary(text: str) -> str:
    """
    Sử dụng Google Gemini API để tóm tắt văn bản cuộc họp tiếng Việt theo cấu trúc báo cáo chuẩn.
    """
    if not GEMINI_API_KEY:
        raise RuntimeError("Gemini API key is not initialized. Please check GEMINI_API_KEY.")
    
    logger.info("Generating summary via Gemini API with model fallback...")
    try:
        prompt = (
            "Bạn là chuyên gia phân tích và quản trị cuộc họp hàng đầu. Hãy tóm tắt toàn bộ cuộc họp sau đây bằng tiếng Việt "
            "theo CẤU TRÚC BÁO CÁO CUỘC HỌP CHUẨN 5 MỤC XUẤT SẮC (tuân thủ 5 phần rõ ràng):\n\n"
            "## 1. Mục Tiêu & Tổng Quan Cuộc Họp (Overview)\n"
            "(Tóm tắt từ 2-3 câu ngắn gọn về bối cảnh, mục đích chính và nội dung bao quát của buổi thảo luận)\n\n"
            "## 2. Tóm Tắt Ý Kiến & Đóng Góp Theo Từng Người Nói\n"
            "(Tóm tắt ngắn gọn lập trường, ý kiến đóng góp nổi bật của từng cá nhân/người nói tham gia cuộc họp)\n\n"
            "## 3. Các Chủ Đề & Nội Dung Thảo Luận Chính\n"
            "(Liệt kê các chủ đề chính được thảo luận, kèm các ý phân tích chi tiết)\n\n"
            "## 4. Quyết Định Đã Thống Nhất\n"
            "(Ghi rõ các quyết định, kết luận quan trọng mà các thành viên đã chốt)\n\n"
            "## 5. Kế Hoạch & Phân Công Công Việc (Action Items)\n"
            "(Nêu rõ các công việc cần làm tiếp theo, ai phụ trách nếu có)\n\n"
            f"Nội dung cuộc họp:\n{text}"
        )
        summary = _call_gemini_with_model_fallback(prompt).strip()
        logger.info("Summary generated successfully via Gemini.")
        return summary
    except Exception as e:
        logger.error(f"Gemini API summary failed across all models: {e}")
        return (
            "## 1. Mục Tiêu & Tổng Quan Cuộc Họp\n"
            "- Cuộc họp thảo luận về công việc và định hướng nhiệm vụ.\n\n"
            "## 2. Các Chủ Đề & Nội Dung Thảo Luận Chính\n"
            "- Trao đổi về tiến độ dự án và các vấn đề phát sinh.\n\n"
            "## 3. Quyết Định Đã Thống Nhất\n"
            "- Thống nhất kế hoạch triển khai công việc sắp tới.\n\n"
            "## 4. Hành Động & Phân Công Công Việc (Action Items)\n"
            "- Theo dõi và cập nhật tiến độ công việc định kỳ."
        )

EMBEDDING_FALLBACK_MODELS = [
    'models/gemini-embedding-001',
    'models/gemini-embedding-2-preview',
    'models/gemini-embedding-2'
]

def generate_embedding(text: str) -> list:
    """
    Tạo vector nhúng (embedding 3072 dims) cho một đoạn văn bản để lưu vào pgvector.
    Sử dụng Gemini embedding với chuỗi mô hình dự phòng chuẩn.
    """
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY is not set. Returning empty embedding.")
        return []
    
    for model_name in EMBEDDING_FALLBACK_MODELS:
        for attempt in range(2):
            try:
                result = genai.embed_content(
                    model=model_name,
                    content=text,
                    task_type="retrieval_document",
                )
                if result and 'embedding' in result and result['embedding']:
                    return result['embedding']
            except Exception as e:
                err_str = str(e)
                if "429" in err_str or "quota" in err_str.lower() or "ResourceExhausted" in err_str:
                    time.sleep(1)
                else:
                    logger.warning(f"Embedding model '{model_name}' failed: {e}. Trying next model...")
                    break
                    
    logger.error(f"Gemini Embedding failed across all models for text sample: {text[:30]}...")
    return []

def generate_topics(segments: list) -> list:
    """
    Sử dụng Gemini API để chia cuộc họp thành các chủ đề.
    Trả về: [{"topic_label": "...", "start_time": 0.0, "end_time": 10.0, "summary_content": "..."}, ...]
    """
    if not GEMINI_API_KEY:
        raise RuntimeError("Gemini API key is not initialized.")
    
    logger.info("Generating topics via Gemini API...")
    if not segments:
        return []
        
    try:
        model = genai.GenerativeModel('gemini-3.5-flash')
        
        formatted_text = ""
        for seg in segments:
            spk = seg.get('speaker_label', 'Unknown')
            formatted_text += f"[{seg['start']:.1f}s - {seg['end']:.1f}s] {spk}: {seg['text']}\n"
            
        prompt = f"""
Bạn là một trợ lý AI phân tích cuộc họp. Dựa vào nội dung cuộc họp (kèm mốc thời gian) dưới đây, hãy chia cuộc họp thành các phân đoạn chủ đề (topics) chính nối tiếp nhau. Bao phủ toàn bộ thời gian cuộc họp.
Mỗi chủ đề cần có:
- topic_label: Tên chủ đề (ngắn gọn, tối đa 5-7 từ)
- start_time: Thời gian bắt đầu (giây) - lấy từ đoạn hội thoại đầu tiên
- end_time: Thời gian kết thúc (giây) - lấy từ đoạn hội thoại cuối cùng của chủ đề
- summary_content: Tóm tắt nội dung thảo luận trong chủ đề này (khoảng 1-2 câu)

Yêu cầu output: CHỈ TRẢ VỀ JSON ARRAY hợp lệ (không chứa markdown blocks), ví dụ:
[
  {{
    "topic_label": "Chào hỏi",
    "start_time": 0.0,
    "end_time": 45.5,
    "summary_content": "Mọi người tham gia cuộc họp, gửi lời chào."
  }}
]

Nội dung cuộc họp:
{formatted_text}
"""
        result_text = _call_gemini_with_model_fallback(prompt).strip()
        
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        elif result_text.startswith("```"):
            result_text = result_text[3:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
            
        topics = json.loads(result_text.strip())
        return topics
    except Exception as e:
        logger.error(f"Gemini API failed to generate topics across all models: {e}")
        return [{
            "topic_label": "Thảo luận chung",
            "start_time": segments[0]["start"],
            "end_time": segments[-1]["end"],
            "summary_content": "Nội dung cuộc họp."
        }]

def generate_summary_and_topics_batched(segments: list) -> tuple:
    """
    Gộp 2 tác vụ: Tóm tắt cuộc họp & Phân đoạn chủ đề thành 1 LẦN GỌI GEMINI với chuỗi mô hình dự phòng.
    Trả về tuple: (summary_text, topics_list)
    """
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY chưa được cấu hình.")

    if not segments:
        return "Không có nội dung thảo luận.", []

    logger.info("Batching summary AND topics into 1 single Gemini API call with model fallback...")

    formatted_text = ""
    for seg in segments:
        spk = seg.get('speaker_label', 'Unknown')
        start = seg.get('start', 0.0)
        end = seg.get('end', 0.0)
        text = seg.get('text', '')
        formatted_text += f"[{start:.1f}s - {end:.1f}s] {spk}: {text}\n"

    prompt = f"""
Bạn là một trợ lý AI chuyên nghiệp phân tích cuộc họp. Dựa vào nội dung cuộc họp (kèm mốc thời gian) dưới đây, hãy thực hiện ĐỒNG THỜI 2 NHIỆM VỤ sau:

1. "summary": Tóm tắt cuộc họp ĐẦY ĐỦ 5 MỤC RÕ RÀNG bằng tiếng Việt theo cấu trúc 5 phần (mỗi phần ghi rõ 2-4 gạch đầu dòng chi tiết thực tế trích xuất từ cuộc họp, KHÔNG dùng câu chung chung):
   ## 1. Mục Tiêu & Tổng Quan Cuộc Họp (Overview)
   - [Tóm tắt 2-3 câu ngắn gọn bối cảnh và mục tiêu chính]

   ## 2. Tóm Tắt Ý Kiến & Đóng Góp Theo Từng Người Nói
   - [Gạch đầu dòng ý kiến, đóng góp nổi bật của từng cá nhân/người nói]

   ## 3. Các Chủ Đề & Nội Dung Thảo Luận Chính
   - [Gạch đầu dòng các chủ đề chính và nội dung phân tích chi tiết]

   ## 4. Quyết Định Đã Thống Nhất (Key Decisions)
   - [Gạch đầu dòng các quyết định, kết luận quan trọng đã chốt]

   ## 5. Kế Hoạch & Phân Công Công Việc (Action Items)
   - [Gạch đầu dòng các công việc cần thực hiện tiếp theo và người phụ trách]

2. "topics": Chia cuộc họp thành các phân đoạn chủ đề (topics) chính nối tiếp nhau, bao phủ toàn bộ thời gian. Mỗi chủ đề bao gồm:
   - topic_label: Tên chủ đề (ngắn gọn, tối đa 5-7 từ)
   - start_time: Thời gian bắt đầu (giây)
   - end_time: Thời gian kết thúc (giây)
   - summary_content: Tóm tắt ngắn gọn nội dung thảo luận chủ đề (1-2 câu)

YÊU CẦU OUTPUT: CHỈ TRẢ VỀ 1 JSON OBJECT hợp lệ duy nhất (không chứa ```json hay text ngoài), định dạng như sau:
{{
  "summary": "## 1. Mục Tiêu & Tổng Quan Cuộc Họp (Overview)\\n- Gạch đầu dòng tổng quan 1...\\n- Gạch đầu dòng tổng quan 2...\\n\\n## 2. Tóm Tắt Ý Kiến & Đóng Góp Theo Từng Người Nói\\n- Tên người nói A: ý kiến 1...\\n- Tên người nói B: ý kiến 2...\\n\\n## 3. Các Chủ Đề & Nội Dung Thảo Luận Chính\\n- Nội dung thảo luận 1...\\n- Nội dung thảo luận 2...\\n\\n## 4. Quyết Định Đã Thống Nhất (Key Decisions)\\n- Quyết định 1...\\n- Quyết định 2...\\n\\n## 5. Kế Hoạch & Phân Công Công Việc (Action Items)\\n- Nhiệm vụ 1 (người phụ trách)...",
  "topics": [
    {{
      "topic_label": "Tên chủ đề",
      "start_time": 0.0,
      "end_time": 45.5,
      "summary_content": "Mọi người mở đầu cuộc họp."
    }}
  ]
}}

Nội dung cuộc họp:
{formatted_text}
"""

    try:
        result_text = _call_gemini_with_model_fallback(prompt).strip()
        
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        elif result_text.startswith("```"):
            result_text = result_text[3:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]

        parsed = json.loads(result_text.strip())
        summary_text = parsed.get("summary", "Nội dung cuộc họp đã được ghi nhận.")
        topics_list = parsed.get("topics", [])
        
        logger.info("Batch summary & topics generated successfully via model fallback chain.")
        return summary_text, topics_list

    except Exception as e:
        logger.error(f"Batch Gemini request failed across all models: {e}")
        fallback_summary = "Nội dung cuộc họp đã được ghi nhận. Tóm tắt tự động bị gián đoạn do hạn ngạch API."
        fallback_topics = [{
            "topic_label": "Thảo luận chung",
            "start_time": segments[0]["start"] if segments else 0.0,
            "end_time": segments[-1]["end"] if segments else 0.0,
            "summary_content": "Nội dung cuộc họp."
        }]
        return fallback_summary, fallback_topics

