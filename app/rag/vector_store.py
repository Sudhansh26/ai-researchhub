import os

# Fix Keras 3 compatibility: ensure sentence-transformers uses tf-keras
os.environ.setdefault("TF_USE_LEGACY_KERAS", "1")

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

from app.config import VECTOR_DB_DIR

_embedding = None


def get_embedding():
    """Lazy-load the embedding model."""
    global _embedding
    if _embedding is None:
        try:
            _embedding = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
        except Exception as e:
            # If sentence-transformers fails (e.g. Keras issue), use a fallback
            error_msg = str(e).lower()
            if "keras" in error_msg or "tensorflow" in error_msg:
                # Retry after forced env setting
                os.environ["TF_USE_LEGACY_KERAS"] = "1"
                _embedding = HuggingFaceEmbeddings(
                    model_name="sentence-transformers/all-MiniLM-L6-v2"
                )
            else:
                raise
    return _embedding


def load_vector_store():
    """Load or create the ChromaDB vector store."""
    return Chroma(
        persist_directory=VECTOR_DB_DIR,
        embedding_function=get_embedding(),
    )
