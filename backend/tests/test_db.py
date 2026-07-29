import os
import sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(__file__))
load_dotenv()

from app.infrastructure.database.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()
try:
    res = db.execute(text("SELECT 1")).scalar()
    print("CONNECTION_SUCCESS:", res)
except Exception as e:
    print("CONNECTION_FAILED:", e)
finally:
    db.close()
