import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)

from dotenv import load_dotenv
load_dotenv()
 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.bootstrap.config import settings

import asyncio
from contextlib import asynccontextmanager
from worker.cleanup_scheduler import cleanup_old_meetings_task

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(cleanup_old_meetings_task())
    yield
    task.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "https://flowremake.up.railway.app",
        "https://flow-remake.up.railway.app",
        "https://empathetic-healing-production.up.railway.app"
    ],
    allow_origin_regex=r"https://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.modules.anonymous_workspace.router import router as workspace_router
app.include_router(workspace_router, prefix=settings.API_V1_STR)

from app.modules.meeting_processing.router import router as audio_router, meetings_router, ai_router
app.include_router(audio_router, prefix=settings.API_V1_STR)
app.include_router(meetings_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)

from app.modules.search_retrieval.router import router as search_router
app.include_router(search_router, prefix=settings.API_V1_STR)

from app.modules.meeting_intelligence.voice_sample_router import router as voice_sample_router
app.include_router(voice_sample_router, prefix=settings.API_V1_STR)

from app.modules.meeting_intelligence.analytics_router import router as analytics_router
app.include_router(analytics_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "backend-node"}
