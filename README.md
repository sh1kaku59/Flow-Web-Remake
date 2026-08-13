# 🌊 FLOW INTELLIGENCE — HỆ THỐNG QUẢN TRỊ & PHÂN TÍCH CUỘC HỌP THÔNG MINH

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20Vite-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.12+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![CUDA](https://img.shields.io/badge/GPU-NVIDIA%20RTX%203050%20CUDA%2012.1-76B900?logo=nvidia)](https://developer.nvidia.com/cuda-toolkit)
[![HuggingFace](https://img.shields.io/badge/AI-HuggingFace%20Qwen2.5%20%7C%20Gemini-FFD21E?logo=huggingface)](https://huggingface.co/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20pgvector-336791?logo=postgresql)](https://github.com/pgvector/pgvector)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS%203%20%7C%20Glassmorphic%20Light%2FDark-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📌 1. GIỚI THIỆU TỔNG QUAN (OVERVIEW)

**FLOW INTELLIGENCE** là hệ thống nền tảng xử lý, tự động hóa và quản trị tri thức cuộc họp thông minh hàng đầu. Hệ thống giúp doanh nghiệp và tổ chức chuyển đổi toàn bộ âm thanh cuộc họp thành văn bản chính xác, phân tách giọng nói theo từng thành viên (Diarization), tự động tóm tắt thành **Biên Bản Họp Chuẩn Doanh Nghiệp Việt Nam** 5 mục xuất sắc, vẽ biểu đồ phân tích hành vi tương tác và hỗ trợ truy vấn tìm kiếm ngữ nghĩa Vector thông minh.

Hệ thống được thiết kế theo kiến trúc tối ưu phần cứng thế hệ mới:
- **Tăng Tốc Phần Cứng GPU CUDA**: Tận dụng 100% sức mạnh card màn hình **NVIDIA GeForce RTX 3050 Laptop GPU** cho mô hình Pyannote.audio & Faster-Whisper, giúp tốc độ bóc băng và phân tách giọng nói nhanh gấp 5 - 10 lần so với CPU.
- **Tóm Tắt Đa Mô Hình (Hybrid AI Summarizer)**: Tích hợp mô hình **Hugging Face Qwen/Qwen2.5-Instruct** chuyên dụng tóm tắt 5 mục chạy trực tiếp trên GPU CUDA, kết hợp chuỗi dự phòng Multi-Model Fallback Chain của Google Gemini API.
- **Bộ Lưu Trữ Lai Thông Minh (Hybrid Storage)**: Hỗ trợ tệp cuộc họp dung lượng lên tới **500MB** (kéo dài 1 - 3 tiếng) với cơ chế tự động chuyển vùng lưu đĩa cứng cục bộ (`temp/uploads/`) vượt rào cản 50MB của Supabase Free Tier.
- **Frontend**: React 18, TypeScript, Vite 5 với ngôn ngữ thiết kế **Glassmorphism UI** sang trọng, chuyển đổi mượt mà giữa **Light Mode & Dark Mode** cùng hệ thống **Đa Ngôn Ngữ Song Ngữ (Việt - Anh)**.
- **Backend**: FastAPI Python (Uvicorn ASGI Server), kiến trúc modul hoá chuẩn mực, lưu trữ Supabase Storage & PostgreSQL `pgvector`.

---

## 🚀 2. TÍNH NĂNG NỔI BẬT ĐẶC SẮC (KEY HIGHLIGHTS)

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

### 🎵 6. Trình Phát Âm Thanh Kính Mờ Thủy Tinh (Glassmorphic Audio Player)
- **Nút kéo Timeline Thủy tinh**: Nút kéo tròn mượt mà chạy trên thanh tiến trình gradient Tím - Xanh.
- **Hover Effect Play/Pause Button**: Nút phát âm thanh trong suốt linh hoạt, nổi dải màu rực rỡ khi trỏ chuột vào.
- **Nút tua nhanh 10 giây (-10s / +10s)**: Hỗ trợ điều hướng bản ghi nhanh chóng.

### 🌓 7. Hỗ Trợ Giao Diện Light / Dark Mode & Song Ngữ Việt - Anh (i18n)
- Chuyển đổi 100% giao diện giữa **Chế độ Sáng (Light Mode)** và **Chế độ Tối (Dark Mode)** cho toàn bộ màn hình, bảng biểu và tất cả các Modal window (Voice Samples Modal, Upload Failed Modal, Rename Diary Modal, Completed Modal, Report Export Modal).
- Hỗ trợ chuyển đổi song ngữ linh hoạt **Tiếng Việt & Tiếng Anh**.

---

## 🛠️ 3. KIẾN TRÚC KỸ THUẬT & CÔNG NGHỆ (TECH STACK)

### 🔹 Frontend Stack
| Thành phần | Công nghệ / Thư viện |
| :--- | :--- |
| **Core Framework** | React 18 + TypeScript + Vite 5 |
| **Styling** | Vanilla CSS + Tailwind CSS 3 (Glassmorphism UI) |
| **Icons** | Lucide React Icons |
| **Internationalization** | Custom LanguageContext (i18n Song ngữ Việt - Anh) |
| **State & Portals** | React Hooks (`useMemo`, `useState`, `useEffect`) & `createPortal` |

### 🔹 Backend Stack
| Thành phần | Công nghệ / Thư viện |
| :--- | :--- |
| **Web Framework** | FastAPI (Python 3.12) running on Uvicorn ASGI |
| **GPU Acceleration** | PyTorch 2.5+ CUDA 12.1 (NVIDIA GeForce RTX 3050) |
| **Database** | PostgreSQL 15+ with `pgvector` extension |
| **ORM & Migrations** | SQLAlchemy ORM & Alembic Database Migrations |
| **Storage Engine** | Supabase Storage + Local Disk Fallback (`temp/uploads/`) |
| **Document Export** | ReportLab PDF Engine, `python-docx`, `pypdf` |

### 🔹 AI Models & Fallback Chain
- **Diarization & STT**: Pyannote.audio 3.1 & Faster-Whisper (CUDA 12.1 GPU Accelerated).
- **5-Section Summarizer**: Hugging Face `Qwen/Qwen2.5-1.5B-Instruct` / `Qwen2.5-3B-Instruct` (GPU CUDA Local).
- **LLM Intelligence**: **Google Gemini 3.5 Flash** (Tóm tắt 5 mục & trích xuất phân đoạn chủ đề).
- **Chuỗi Mô Hình Dự Phòng (Multi-Model Fallback Chain)**: Tự động chuyển đổi mô hình tức thì nếu gặp lỗi giới hạn hạn ngạch (429 Rate Limit):
  $$\text{gemini-3.5-flash} \rightarrow \text{gemini-3.5-flash-lite} \rightarrow \text{gemini-3.1-flash-lite} \rightarrow \text{gemini-3-flash-preview} \rightarrow \text{gemini-2.5-pro} \rightarrow \text{gemini-2.0-flash}$$
- **Vector Embedding**: **Google Gemini Embedding 001** (`models/gemini-embedding-001`, 3072 dimensions).

---

## 📂 4. CẤU TRÚC THƯ MỤC CHUẨN XÁC DỰ ÁN (DIRECTORY STRUCTURE)

```
Source Code - Flow/
├── .gitignore                      # File cấu hình bỏ qua Git (Node modules, venv, .env, temp audio)
├── README.md                       # File tài liệu hướng dẫn tổng quan & cài đặt hệ thống
├── start_flow_local.bat            # Bộ khởi chạy 1-Click cho ứng dụng Demo Local
├── start_tunnel.bat                # Bộ khởi chạy Cloudflare Tunnel chia sẻ link công cộng
│
├── backend/                        # THƯ MỤC MÃ NGUỒN BACKEND (FASTAPI PYTHON)
│   ├── .env                        # Biến môi trường Backend (Chứa DB URL, Supabase & Gemini API Key)
│   ├── alembic.ini                 # File cấu hình Alembic Database Migrations
│   ├── requirements.txt            # Danh sách gói thư viện phụ thuộc Python
│   │
│   ├── app/                        # Ứng dụng chính FastAPI
│   │   ├── api/                    # Router registry & main entry point (main.py)
│   │   ├── bootstrap/              # Khởi tạo cấu hình môi trường hệ thống
│   │   ├── infrastructure/         # Kết nối Database SQLAlchemy, pgvector & Supabase Storage
│   │   ├── modules/                # Các Module nghiệp vụ chính
│   │   │   ├── anonymous_workspace/# Router quản lý Anonymous Workspace
│   │   │   ├── meeting_intelligence/# Voice samples, Speaker Statistics, Report PDF Export & Analytics
│   │   │   ├── meeting_processing/ # Audio upload, Status SSE polling, Processing jobs
│   │   │   └── search_retrieval/   # Vector Search API (pgvector + Gemini Embedding)
│   │   └── shared_kernel/          # Dataclass, schemas & domain models dùng chung
│   │
│   ├── worker/                     # Worker tiến trình xử lý ngầm (Background Worker Pipeline)
│   │   ├── pipelines/              # Các pipeline con (diarization, transcription, qwen_summarizer, semantic)
│   │   └── tasks.py                # Hàm thực thi quy trình 3 bước xử lý âm thanh & AI
│   │
│   ├── temp/                       # Thư mục tạm lưu tệp âm thanh trong quá trình xử lý (.gitkeep)
│   └── venv/                       # Môi trường ảo Python (Virtual Environment)
│
└── frontend/                       # THƯ MỤC MÃ NGUỒN FRONTEND (REACT + VITE + TS)
    ├── .env                        # Biến môi trường Frontend (Chứa Base API URL)
    ├── index.html                  # File HTML chính của ứng dụng Vite
    ├── package.json                # Thư viện npm & script khởi chạy
    ├── vite.config.ts              # File cấu hình Vite Bundler
    ├── tailwind.config.js          # File cấu hình Tailwind CSS & Glassmorphism Theme
    ├── tsconfig.json               # Cấu hình TypeScript compiler
    │
    └── src/                        # Thư mục chứa mã nguồn React TypeScript
        ├── App.tsx                 # Client-side Router chính & Quản lý điều hướng trang
        ├── main.tsx                # Entry point render React DOM Root
        ├── index.css               # Custom Styles, Animation & Tailwind Directives
        │
        ├── landing/                # Trang giới thiệu Landing Page & 3 thẻ tính năng
        ├── upload/                 # Màn hình Tải tệp âm thanh & Tiến trình 3 bước AI
        │   ├── components/         # DropzoneArea, ProcessingView & các Modal thông báo
        │   └── types.ts            # Dynamic Upload State type definitions
        │
        ├── diary-list/             # Trang Nhật ký cuộc họp (Diary List View)
        │   ├── components/         # DiaryCard, RenameModal (Hỗ trợ Light/Dark & Song ngữ)
        │   └── hooks/              # Custom hook useDiary fetched data
        │
        ├── diary-detail/           # Trang Chi tiết & Phân tích Nhật ký Cuộc họp
        │   ├── components/         # AudioPlayer, ChartPanel, SummaryPanel, ReportExportModal, TranscriptList
        │   └── mockApi.ts          # Gateway chuyển đổi dữ liệu Backend -> Frontend ViewModel
        │
        └── shared/                 # Thành phần dùng chung toàn bộ ứng dụng
            ├── components/         # Header, Modals, Failure Dialogs
            └── i18n/               # LanguageContext & File từ điển bản dịch translations.ts
```

---

## ⚙️ 5. HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY DỰ ÁN (INSTALLATION & SETUP)

### 📋 1. Yêu Cầu Hệ Thống (Prerequisites)
- **Python**: Version 3.10 trở lên
- **Node.js**: Version v18.0.0 trở lên & `npm`
- **PostgreSQL**: Version 15+ (Khuyên dùng PostgreSQL trên Supabase đã bật sẵn extension `pgvector`).
- **NVIDIA GPU Driver & CUDA 12.1** (Khuyên dùng card RTX 3050 trở lên để tăng tốc).
- **Google Gemini API Key**: Đăng ký lấy API Key tại Google AI Studio.

---

### 🐍 2. Cài Đặt & Khởi Chạy Backend (Python FastAPI)

1. Di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```

2. Tạo và kích hoạt môi trường ảo Python (Virtual Environment):
   ```bash
   python -m venv venv
   
   # Trên Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   
   # Trên Linux/macOS:
   source venv/bin/activate
   ```

3. Cài đặt PyTorch hỗ trợ CUDA 12.1:
   ```bash
   pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121
   ```

4. Cài đặt các gói thư viện phụ thuộc:
   ```bash
   pip install -r requirements.txt
   ```

5. Tạo tệp `.env` trong thư mục `backend/.env`:
   ```env
   SUPABASE_URL=https://your-supabase-project.supabase.co
   SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   SUPABASE_SECRET_KEY=your-supabase-secret-key
   
   DATABASE_URL="postgresql://postgres:password@host:5432/postgres"
   
   HF_TOKEN="your_huggingface_token"
   GEMINI_API_KEY="your_google_gemini_api_key"
   ```

6. Khởi chạy máy chủ FastAPI Backend:
   ```bash
   uvicorn app.api.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   *Máy chủ Backend sẽ hoạt động tại: `http://localhost:8000` (Tài liệu API Swagger Docs: `http://localhost:8000/docs`).*

---

### ⚛️ 3. Cài Đặt & Khởi Chạy Frontend (React + Vite)

1. Mở cửa sổ terminal mới và di chuyển vào thư mục `frontend`:
   ```bash
   cd frontend
   ```

2. Cài đặt các thư viện npm:
   ```bash
   npm install
   ```

3. Tạo tệp `.env` trong thư mục `frontend/.env`:
   ```env
   VITE_API_BASE_URL="http://localhost:8000/api/v1"
   VITE_USE_MOCK_DIARY="false"
   ```

4. Khởi chạy máy chủ Frontend Dev Server:
   ```bash
   npm run dev
   ```
   *Máy chủ Frontend sẽ hoạt động tại: `http://localhost:5173`.*

---

## ⚡ 6. KHỞI CHẠY BẢN DEMO BẰNG BỘ KHỞI CHẠY 1-CLICK (LOCAL DEMO LAUNCHERS)

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

## 🔒 7. BẢO MẬT & TỰ ĐỘNG DỌN DẸP DỮ LIỆU (PRIVACY & AUTO PURGE)

1. **Auto Voice Sample Deletion**: Tất cả mẫu giọng nói tải lên để định danh thành viên sẽ tự động bị xóa vĩnh viễn khỏi Storage ngay khi quá trình nhận diện hoàn tất.
2. **Auto Purge TTL**: Tiến trình dọn dẹp tự động giải phóng dung lượng đĩa và dữ liệu cũ định kỳ.

---
<img width="1923" height="920" alt="image" src="https://github.com/user-attachments/assets/2e368847-ff04-4a30-b555-a32da5024138" />

### 📜 LICENSE & CREDITS
- Developed with ❤️ by **Flow Intelligence Team**.
- Built with React 18, FastAPI, PyTorch CUDA, Hugging Face Qwen & Google Gemini AI.
