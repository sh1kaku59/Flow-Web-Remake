# 🌊 FLOW INTELLIGENCE — HỆ THỐNG QUẢN TRỊ & PHÂN TÍCH CUỘC HỌP THÔNG MINH

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20Vite-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.10+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini%203.5%20Flash%20%7C%20Embedding%20001-8E44AD?logo=google)](https://ai.google.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20pgvector-336791?logo=postgresql)](https://github.com/pgvector/pgvector)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS%203%20%7C%20Glassmorphic%20Light%2FDark-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📌 1. GIỚI THIỆU TỔNG QUAN (OVERVIEW)

**FLOW INTELLIGENCE** là hệ thống nền tảng xử lý, tự động hóa và quản trị tri thức cuộc họp thông minh hàng đầu. Hệ thống giúp doanh nghiệp và tổ chức chuyển đổi toàn bộ âm thanh cuộc họp thành văn bản chính xác, phân tách giọng nói theo từng thành viên (Diarization), tự động tóm tắt thành **Biên Bản Họp Chuẩn Doanh Nghiệp Việt Nam** 5 mục xuất sắc, vẽ biểu đồ phân tích hành vi tương tác và hỗ trợ truy vấn tìm kiếm ngữ nghĩa Vector thông minh.

Hệ thống được thiết kế theo kiến trúc hiện đại chuẩn chỉnh:
- **Frontend**: React 18, TypeScript, Vite 5 với ngôn ngữ thiết kế **Glassmorphism UI** sang trọng, chuyển đổi mượt mà giữa **Light Mode & Dark Mode** cùng hệ thống **Đa Ngôn Ngữ Song Ngữ (Việt - Anh)**.
- **Backend**: FastAPI Python (Uvicorn ASGI Server), kiến trúc modul hoá chuẩn mực, lưu trữ Supabase Storage, tích hợp chuỗi AI tự động dự phòng **Multi-Model Fallback Chain** của Google Gemini API.

---

## 🚀 2. TÍNH NĂNG NỔI BẬT ĐẶC SẮC (KEY HIGHLIGHTS)

### 🎙️ 1. Tiến Trình Xử Lý Âm Thanh 3 Bước Tự Động & Phản Hồi Tức Thì (3-Step AI Pipeline)
- **Phản hồi tức thì 0ms (Instant Upload Feedback)**: Ngay khi nhấn nút tải tệp âm thanh, hệ thống lập tức hiển thị màn hình khởi tạo tiến trình AI với hiệu ứng hạt sóng lấp lánh, hoàn toàn loại bỏ cảm giác chờ đợi mơ hồ.
- **Bước 1 - Tiền xử lý & Khởi tạo (Audio Preprocessing & Voice Sample Matching)**: Chuẩn hóa định dạng âm thanh (WAV/MP3/M4A) và tự động đối soát kho mẫu giọng nói để định danh thành viên.
- **Bước 2 - Phân tách người nói & Chuyển âm thanh thành văn bản (Diarization & STT)**: Sử dụng mô hình Pyannote.audio & Whisper bóc tách chính xác từng câu thoại kèm mốc thời gian (Timestamp Alignment).
- **Bước 3 - Phân tích ngữ nghĩa & Tạo báo cáo (Semantic Analysis & Summary)**: Tổng hợp nội dung cuộc họp bằng trí tuệ nhân tạo Gemini LLM.
- **Thời gian dự kiến đếm ngược động (Dynamic Audio-Based Estimation)**: Tự động đo độ dài cuộc họp để tính toán chính xác số giây dự kiến cho từng bước, kèm các thông báo ngữ cảnh linh hoạt khi sắp hoàn tất.

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
- **Định danh tên người nói chuẩn xác 100%**: Truy vấn trực tiếp từ bảng cơ sở dữ liệu `Speaker` để map ID thành **tên thật đàng hoàng của thành viên** (như `Minh vẽ`, `Đức cớp`, `Khánh`,...), loại bỏ triệt để các mã UUID thô hoặc tên mặc định "Thành viên A/B".
- **Hỗ trợ 2 mẫu xuất báo cáo**: Mẫu Tiêu Chuẩn Hệ Thống (System Standard Template) và Mẫu Dàn Ý Tùy Chỉnh do người dùng tải lên (.docx / .pdf).

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
| **Web Framework** | FastAPI (Python 3.10+) running on Uvicorn ASGI |
| **Database** | PostgreSQL 15+ with `pgvector` extension (or SQLite for local dev) |
| **ORM & Migrations** | SQLAlchemy ORM & Alembic Database Migrations |
| **Storage & Bucket** | Supabase Storage (Bucket `meetings`) |
| **Document Export** | ReportLab PDF Engine, `python-docx`, `pypdf` |

### 🔹 AI Models & Fallback Chain
- **LLM Intelligence**: **Google Gemini 3.5 Flash** (Tóm tắt 5 mục & trích xuất phân đoạn chủ đề).
- **Chuỗi Mô Hình Dự Phòng (Multi-Model Fallback Chain)**: Tự động chuyển đổi mô hình tức thì nếu gặp lỗi giới hạn hạn ngạch (429 Rate Limit):
  $$\text{gemini-3.5-flash} \rightarrow \text{gemini-3.5-flash-lite} \rightarrow \text{gemini-3.1-flash-lite} \rightarrow \text{gemini-3-flash-preview} \rightarrow \text{gemini-2.5-pro} \rightarrow \text{gemini-2.0-flash}$$
- **Vector Embedding**: **Google Gemini Embedding 001** (`models/gemini-embedding-001`, 3072 dimensions).
- **Diarization & STT**: Pyannote.audio & OpenAI Whisper.

---

## 📂 4. CẤU TRÚC THƯ MỤC CHUẨN XÁC DỰ ÁN (DIRECTORY STRUCTURE)

```
Source Code - Flow/
├── .gitignore                      # File cấu hình bỏ qua Git (Node modules, venv, .env, temp audio)
├── README.md                       # File tài liệu hướng dẫn tổng quan & cài đặt hệ thống
│
├── backend/                        # THƯ MỤC MÃ NGUỒN BACKEND (FASTAPI PYTHON)
│   ├── .env                        # Biến môi trường Backend (Chứa DB URL, Supabase & Gemini API Key)
│   ├── .env.example                # File mẫu cấu hình biến môi trường Backend
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
│   │   ├── pipelines/              # Các pipeline con (audio_processor, diarization, transcription, semantic)
│   │   ├── tasks.py                # Hàm thực thi quy trình 3 bước xử lý âm thanh & AI
│   │   └── cleanup_scheduler.py    # Tiến trình tự động dọn dẹp dữ liệu cũ (Auto Purge)
│   │
│   ├── migrations/                 # Thư mục lưu vết Database Migrations Alembic
│   ├── temp/                       # Thư mục tạm lưu tệp âm thanh trong quá trình xử lý (.gitkeep)
│   └── venv/                       # Môi trường ảo Python (Virtual Environment)
│
└── frontend/                       # THƯ MỤC MÃ NGUỒN FRONTEND (REACT + VITE + TS)
    ├── .env                        # Biến môi trường Frontend (Chứa Base API URL)
    ├── .env.example                # File mẫu cấu hình biến môi trường Frontend
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

## ⚙️ 5. HƯỚNG DẪN CÀI ĐẶT & KHỦY CHẠY DỰ ÁN (INSTALLATION & SETUP)

### 📋 1. Yêu Cầu Hệ Thống (Prerequisites)
- **Python**: Version 3.10 trở lên
- **Node.js**: Version v18.0.0 trở lên & `npm`
- **PostgreSQL**: Version 15+ (Khuyên dùng PostgreSQL trên Supabase đã bật sẵn extension `pgvector`).
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

3. Cài đặt các gói thư viện phụ thuộc:
   ```bash
   pip install -r requirements.txt
   ```

4. Tạo tệp `.env` trong thư mục `backend/.env` (Tham khảo `backend/.env.example`):
   ```env
   SUPABASE_URL=https://your-supabase-project.supabase.co
   SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   SUPABASE_SECRET_KEY=your-supabase-secret-key
   SUPABASE_JWKS_URL=https://your-supabase-project.supabase.co/auth/v1/.well-known/jwks.json
   
   DATABASE_URL="postgresql://postgres:password@host:5432/postgres"
   
   HF_TOKEN="your_huggingface_token"
   GEMINI_API_KEY="your_google_gemini_api_key"
   ```

5. Chạy Database Migration để khởi tạo các bảng và extension `pgvector`:
   ```bash
   alembic upgrade head
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

3. Tạo tệp `.env` trong thư mục `frontend/.env` (Tham khảo `frontend/.env.example`):
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
