import os
import logging
import torch
from typing import Optional

logger = logging.getLogger(__name__)

_qwen_tokenizer = None
_qwen_model = None

QWEN_MODEL_NAME = os.getenv("QWEN_MODEL_NAME", "Qwen/Qwen2.5-1.5B-Instruct")

def get_qwen_model():
    global _qwen_tokenizer, _qwen_model
    if _qwen_model is None:
        try:
            from transformers import AutoModelForCausalLM, AutoTokenizer
            logger.info(f"Loading HuggingFace Qwen Summarizer Model '{QWEN_MODEL_NAME}' on CUDA...")
            
            device = "cuda" if torch.cuda.is_available() else "cpu"
            torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

            _qwen_tokenizer = AutoTokenizer.from_pretrained(QWEN_MODEL_NAME, trust_remote_code=True)
            _qwen_model = AutoModelForCausalLM.from_pretrained(
                QWEN_MODEL_NAME,
                torch_dtype=torch_dtype,
                device_map="auto" if torch.cuda.is_available() else None,
                trust_remote_code=True
            )
            logger.info("Qwen Summarizer Model loaded successfully on GPU CUDA.")
        except Exception as e:
            logger.error(f"Failed to load Qwen model '{QWEN_MODEL_NAME}': {e}")
            _qwen_model = None
            _qwen_tokenizer = None

    return _qwen_tokenizer, _qwen_model

def generate_qwen_summary(text: str) -> Optional[str]:
    """
    Sử dụng mô hình HuggingFace Qwen2.5-Instruct để tóm tắt văn bản cuộc họp
    TUÂN THỦ 100% CẤU TRÚC BÁO CÁO CUỘC HỌP CHUẨN 5 MỤC XUẤT SẮC.
    """
    try:
        tokenizer, model = get_qwen_model()
        if not tokenizer or not model:
            return None

        prompt = (
            "Bạn là chuyên gia phân tích và quản trị cuộc họp hàng đầu. Hãy tóm tắt toàn bộ cuộc họp sau đây bằng tiếng Việt "
            "theo CẤU TRÚC BÁO CÁO CUỘC HỌP CHUẨN 5 MỤC XUẤT SẮC (tuân thủ 5 phần rõ ràng, trình bày bằng Markdown):\n\n"
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

        messages = [
            {"role": "system", "content": "Bạn là trợ lý AI chuyên nghiệp phân tích và tóm tắt cuộc họp doanh nghiệp bằng tiếng Việt."},
            {"role": "user", "content": prompt}
        ]

        text_input = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )

        model_inputs = tokenizer([text_input], return_tensors="pt").to(model.device)

        generated_ids = model.generate(
            **model_inputs,
            max_new_tokens=1500,
            temperature=0.3,
            top_p=0.9,
            repetition_penalty=1.1
        )

        generated_ids = [
            output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
        ]

        response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
        return response.strip()
    except Exception as e:
        logger.error(f"Error in Qwen summarizer generation: {e}")
        return None
