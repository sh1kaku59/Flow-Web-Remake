# 🌊 FLOW INTELLIGENCE — HỆ THỐNG QUẢN TRỊ & PHÂN TÍCH CUỘC HỌP THÔNG MINH

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20Vite-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.12+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![CUDA](https://img.shields.io/badge/GPU-NVIDIA%20RTX%203050%20CUDA%2012.1-76B900?logo=nvidia)](https://developer.nvidia.com/cuda-toolkit)
[![HuggingFace](https://img.shields.io/badge/AI-HuggingFace%20Qwen2.5%20%7C%20Gemini-FFD21E?logo=huggingface)](https://huggingface.co/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20pgvector-336791?logo=postgresql)](https://github.com/pgvector/pgvector)

---

## 📌 1. GIỚI THIỆU TỔNG QUAN (OVERVIEW)

**FLOW INTELLIGENCE** là hệ thống nền tảng xử lý, tự động hóa và quản trị tri thức cuộc họp thông minh hàng đầu. Hệ thống giúp doanh nghiệp và tổ chức chuyển đổi toàn bộ âm thanh cuộc họp thành văn bản chính xác, phân tách giọng nói theo từng thành viên (Diarization), tự động tóm tắt thành **Biên Bản Họp Chuẩn Doanh Nghiệp Việt Nam** 5 mục xuất sắc, vẽ biểu đồ phân tích hành vi tương tác và hỗ trợ truy vấn tìm kiếm ngữ nghĩa Vector thông minh.

Hệ thống được tối ưu phần cứng thế hệ mới:
- **Tăng Tốc Phần Cứng GPU CUDA**: Tận dụng 100% sức mạnh card màn hình **NVIDIA GeForce RTX 3050 Laptop GPU** cho mô hình Pyannote.audio & Faster-Whisper, giúp tốc độ bóc băng và phân tách giọng nói nhanh gấp 5 - 10 lần so với CPU.
- **Tóm Tắt Đa Mô Hình (Hybrid AI Summarizer)**: Tích hợp mô hình **Hugging Face Qwen/Qwen2.5-Instruct** chuyên dụng tóm tắt 5 mục chạy trực tiếp trên GPU CUDA, kết hợp chuỗi dự phòng Multi-Model Fallback Chain của Google Gemini API.
- **Bộ Lưu Trữ Lai Thông Minh (Hybrid Storage)**: Hỗ trợ tệp cuộc họp dung lượng lên tới **500MB** (kéo dài 1 - 3 tiếng) với cơ chế tự động chuyển vùng lưu đĩa cứng cục bộ (`temp/uploads/`) vượt rào cản 50MB của Supabase Free Tier.
- **Frontend**: React 18, TypeScript, Vite 5 với giao diện **Glassmorphism UI** sang trọng, chuyển đổi mượt mà giữa **Light Mode & Dark Mode** cùng hệ thống **Đa Ngôn Ngữ Song Ngữ (Việt - Anh)**.

---

## 🚀 2. TÍNH NẢNG NỔI BẬT ĐẶC SẮC (KEY HIGHLIGHTS)

### 🎙️ 1. Tiến Trình Xử Lý Âm Thanh 3 Bước Tự Động & Phản Hồi Tức Thì (3-Step AI Pipeline)
- **Phản hồi tức thì 0ms (Instant Upload Feedback)**: Ngay khi nhấn nút tải tệp âm thanh, hệ thống lập tức hiển thị màn hình khởi tạo tiến trình AI với hiệu ứng hạt sóng lấp lánh, hoàn toàn loại bỏ cảm giác chờ đợi mơ hồ.
- **Bước 1 - Tiền xử lý & Khởi tạo (Audio Preprocessing & Voice Sample Matching)**: Chuẩn hóa định dạng âm thanh (WAV/MP3/M4A) bằng FFmpeg 16kHz Mono và tự động đối soát kho mẫu giọng nói để định danh thành viên.
- **Bước 2 - Phân tách người nói & Chuyển âm thanh thành văn bản (Diarization & STT)**: Sử dụng mô hình Pyannote.audio 3.1 & Faster-Whisper bóc tách chính xác từng câu thoại kèm mốc thời gian (Timestamp Alignment) trên GPU RTX 3050 CUDA.
- **Bước 3 - Phân tích ngữ nghĩa & Tạo báo cáo (Semantic Analysis & Summary)**: Tổng hợp nội dung cuộc họp bằng mô hình Hugging Face Qwen2.5 GPU & Gemini LLM.
- **Thời gian đếm lùi Real-time (Dynamic Countdown Timer)**: Đồng hồ đếm lùi từng giây trực quan giúp người dùng theo dõi chuẩn xác từng giai đoạn xử lý.

### 📝 2. Tóm Tắt Cuộc Họp Chuẩn 5 Mục Rõ Ràng (Smart 5-Section Summary Panel)
Trích xuất tự động 100% tri thức từ bản ghi âm thành 5 khung thẻ kính mờ độc lập với gạch đầu dòng thực tế chi tiết:
1. **1. Mục Tiêu & Tổng Quan Cuộc Họp (Overview)**: Tóm tắt bối cảnh và mục tiêu trọng tâm.
2. **2. Tóm Tắt Ý Kiến & Đóng Góp Theo Từng Người Nói**: Ghi rõ lập trường và đóng góp nổi bật của từng cá nhân tham gia.
3. **3. Các Chủ Đề & Nội Dung Thảo Luận Chính**: Phân tích chi tiết từng chủ đề.
4. **4. Quyết Định Đã Thống Nhất (Key Decisions)**: Liệt kê các quyết định và kết luận đã chốt.
5. **5. Kế Hoạch & Phân Công Công Việc (Action Items)**: Nhiệm vụ cụ thể và người phụ trách.

### 📊 3. Biểu Đồ Phân Tích Hành Vi & Cường Độ Thảo Luận (Speaker & Discussion Analytics)
- **Biểu đồ thời lượng & lượt phát biểu**: Thống kê tỉ lệ % thời lượng nói và số lượt cất lời của từng thành viên.
- **Biểu đồ tỉ lệ phân bổ chủ đề (Topic Transition)**: Hiển thị thanh tỉ lệ phần trăm thảo luận từng chủ đề.
- **Biểu đồ cường độ thảo luận (Discussion Intensity Timeline)**: Theo dõi nhịp độ thảo luận theo mốc thời gian thực, tự động phát hiện mốc **Peak Discussion (Thời điểm thảo luận sôi nổi nhất)**.

### 📄 4. Xuất Báo Cáo PDF Chuẩn Mẫu Biên Bản Họp Việt Nam (PDF Minutes Export)
- **Chuẩn mực văn bản hành chính Việt Nam**: Đầy đủ **Quốc hiệu & Tiêu ngữ**, Tên cơ quan đơn vị, Ngày tháng năm in rõ thời gian thực (`Ngày DD tháng MM năm YYYY`), Mục tiêu, Nội dung thảo luận, Bảng Action Items 4 cột, Ghi chú khuyến nghị AI và Khung ký tên **Thư ký & Chủ tọa**.
- **Định danh tên người nói chuẩn xác 100%**: Truy vấn trực tiếp từ bảng cơ sở dữ liệu `Speaker` để map ID thành **tên thật đàng hoàng của thành viên** (như `Minh`, `Đức`, `Khánh`,...), loại bỏ triệt để các mã UUID thô hoặc tên mặc định "Thành viên A/B".

### 🔍 5. Tìm Kiếm Ngữ Nghĩa Smart Semantic Search & Bộ Lọc Nâng Cao (pgvector)
- **Tìm kiếm ý nghĩa tự nhiên (Natural Query)**: Cho phép gõ câu hỏi tự nhiên theo ý nghĩa (Ví dụ: *"Khi nào chúng ta bàn về ngân sách dự án?"*).
- **Vector Embedding 3072 dimensions**: Mã hóa câu thoại thành Vector 3072 chiều bằng `models/gemini-embedding-001` và tính khoảng cách Cosine trên `pgvector`.
- **Bộ lọc 4 chế độ**: Lọc chuẩn xác theo **Nội dung** (Content), **Người nói** (Speaker), **Mốc thời gian** (Timestamp), và **Chủ đề** (Topic).

---

## 🛠️ 3. KIẾN TRÚC KỸ THUẬT & CÔNG NGHỆ (TECH STACK)

### 🔹 Frontend Stack
| Thành phần | Công nghệ / Thư viện |
| :--- | :--- |
| **Core Framework** | React 18 + TypeScript + Vite 5 |
| **Styling** | Vanilla CSS + Tailwind CSS 3 (Glassmorphism UI) |
| **Icons** | Lucide React Icons |
| **Internationalization** | Custom LanguageContext (i18n Song ngữ Việt - Anh) |
| **State & Portals** | React Hooks & `createPortal` |

### 🔹 Backend Stack
| Thành phần | Công nghệ / Thư viện |
| :--- | :--- |
| **Web Framework** | FastAPI (Python 3.12) running on Uvicorn ASGI |
| **GPU Acceleration** | PyTorch 2.5+ CUDA 12.1 (NVIDIA GeForce RTX 3050) |
| **Database** | PostgreSQL 15+ with `pgvector` extension |
| **ORM & Migrations** | SQLAlchemy ORM & Alembic Database Migrations |
| **Storage Engine** | Supabase Storage + Local Disk Fallback (`temp/uploads/`) |
| **Document Export** | ReportLab PDF Engine, `python-docx`, `pypdf` |

### 🔹 AI Models & Pipeline
- **Diarization & STT**: Pyannote.audio 3.1 & Faster-Whisper (CUDA 12.1 GPU Accelerated).
- **5-Section Summarizer**: Hugging Face `Qwen/Qwen2.5-1.5B-Instruct` / `Qwen2.5-3B-Instruct` (GPU CUDA Local).
- **Semantic Intelligence**: Google Gemini 3.5 Flash & Gemini Embedding 001.

---

## ⚡ 4. KHỞI CHẠY BẢN DEMO NỔI BẰNG BỘ KHỞI CHẠY 1-CLICK (LOCAL DEMO LAUNCHERS)

Hệ thống được trang bị 2 bộ khởi chạy tự động dạng file `.bat` cực kỳ tiện lợi:

### 1. Khởi chạy Ứng dụng Demo Local (1-Click Local Launcher)
Nhấn đúp chuột vào file **`start_flow_local.bat`** tại thư mục gốc:
- Tự động kích hoạt môi trường ảo Python `backend/venv`.
- Khởi chạy Backend FastAPI Uvicorn tại `http://localhost:8000`.
- Khởi chạy Frontend React Vite tại `http://localhost:5173`.

### 2. Chia Sẻ Đường Dẫn Truy Cập Công Cộng (Public Tunnel Launcher)
Nhấn đúp chuột vào file **`start_tunnel.bat`**:
- Tự động kích hoạt Cloudflare Tunnel với vòng lặp tự nối lại kết nối (`:loop`).
- Cấp đường dẫn công cộng `https://...trycloudflare.com` giúp bất kỳ ai cũng có thể truy cập trải nghiệm Demo ứng dụng từ xa.

---

## 🔒 5. BẢO MẬT & TỰ ĐỘNG DỌN DẸP DỮ LIỆU (PRIVACY & AUTO PURGE)

1. **Auto Voice Sample Deletion**: Tất cả mẫu giọng nói tải lên để định danh thành viên sẽ tự động bị xóa vĩnh viễn khỏi Storage ngay khi quá trình nhận diện hoàn tất.
2. **Auto Purge TTL**: Tiến trình dọn dẹp tự động giải phóng dung lượng đĩa và dữ liệu cũ định kỳ.

---

### 📜 LICENSE & CREDITS
- Developed with ❤️ by **Flow Intelligence Team**.
- Built with React 18, FastAPI, PyTorch CUDA, Hugging Face Qwen & Google Gemini AI.```bash
   npm run dev
   ```
   *Máy chủ Frontend sẽ hoạt động tại: `http://localhost:5173`.*

---

## 🚀 6. HƯỚNG DẪN BACKUP GITHUB & DEPLOY RAILWAY (DEPLOYMENT GUIDE)

### 📦 1. Khởi Tạo Git & Push Code Lên GitHub Repo
1. Kiểm tra trạng thái Git tại thư mục gốc:
   ```bash
   git status
   ```
2. Thêm tất cả tệp nguồn sạch vào Git tracking:
   ```bash
   git add .
   ```
3. Commit mã nguồn:
   ```bash
   git commit -m "feat: complete flow meeting intelligence platform ready for release"
   ```
4. Kết nối và push lên GitHub repository của bạn:
   ```bash
   git remote add origin https://github.com/your-username/flow-meeting-intelligence.git
   git branch -M main
   git push -u origin main
   ```

---

### 🚂 2. Deploy Backend & Frontend Lên Railway Platform
1. **Đăng nhập Railway**: Truy cập [Railway.app](https://railway.app/) và kết nối tài khoản GitHub.
2. **Deploy Backend Service**:
   - Chọn **New Project** ➔ **Deploy from GitHub repo** ➔ Chọn repo `flow-meeting-intelligence`.
   - Đặt Root Directory cho Backend: `backend`.
   - Thiết lập **Variables** (Copy toàn bộ biến từ `backend/.env`):
     - `DATABASE_URL`
     - `SUPABASE_URL`, `SUPABASE_SECRET_KEY`
     - `GEMINI_API_KEY`, `HF_TOKEN`
   - Start Command: `uvicorn app.api.main:app --host 0.0.0.0 --port $PORT`
3. **Deploy Frontend Service**:
   - Thêm Service mới trong cùng Project trên Railway ➔ Chọn repo ➔ Root Directory: `frontend`.
   - Thiết lập **Variables**:
     - `VITE_API_BASE_URL` = URL Domain của Backend Service đã deploy trên Railway (ví dụ: `https://flow-backend-production.up.railway.app/api/v1`).
     - `VITE_USE_MOCK_DIARY` = `false`
   - Build Command: `npm run build`
   - Start Command: `npx serve -s dist -l $PORT`

---

## 🔒 7. BẢO MẬT & TỰ ĐỘNG DỌN DẸP DỮ LIỆU (PRIVACY & AUTO PURGE)

1. **Auto Voice Sample Deletion**: Tất cả mẫu giọng nói tải lên để định danh thành viên sẽ tự động bị xóa vĩnh viễn khỏi Supabase Storage ngay khi quá trình nhận diện hoàn tất.
2. **24-Hour Auto Purge TTL**: Tiến trình chạy ngầm (`cleanup_scheduler.py`) tự động quét định kỳ và giải phóng dung lượng, xóa sạch các bản ghi âm cuộc họp trên Supabase đã quá 24 giờ.

---

### 📜 LICENSE & CREDITS
- Developed with ❤️ by **Flow Intelligence Team**.
- Built with React 18, FastAPI, Google Gemini AI & ReportLab PDF.
