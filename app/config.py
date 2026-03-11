import os
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover
    load_dotenv = None

if load_dotenv is not None:
    load_dotenv(Path(__file__).resolve().parents[1] / '.env')


HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY', '').strip()
HF_MODEL = os.getenv('HF_MODEL', 'Qwen/Qwen2.5-1.5B-Instruct').strip()

VECTOR_DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'vector_db')
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads')

MAX_SEARCH_RESULTS = 5
CHUNK_SIZE = 800
CHUNK_OVERLAP = 100

os.makedirs(VECTOR_DB_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)
