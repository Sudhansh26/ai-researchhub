from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import CHUNK_OVERLAP, CHUNK_SIZE
from .vector_store import load_vector_store


def ingest_pdf(path: str) -> int:
    """Ingest a PDF file into the vector store and return the chunk count."""
    loader = PyPDFLoader(path)
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )
    chunks = splitter.split_documents(docs)

    db = load_vector_store()
    db.add_documents(chunks)

    return len(chunks)
