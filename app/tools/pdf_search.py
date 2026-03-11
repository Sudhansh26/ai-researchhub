from app.rag.vector_store import load_vector_store


def pdf_search(query: str) -> str:
    """Search through uploaded PDF documents for relevant information."""
    try:
        db = load_vector_store()
        docs = db.similarity_search(query, k=3)

        if not docs:
            return "No relevant content found in uploaded documents. Please upload a PDF first."

        results = []
        for index, doc in enumerate(docs, 1):
            source = doc.metadata.get("source", "Unknown PDF")
            page = doc.metadata.get("page", "?")
            results.append(f"[DOC {index}] Source: {source}, Page: {page}\n{doc.page_content}")

        return "\n\n---\n\n".join(results)
    except Exception as e:
        return f"PDF search error: {str(e)}. Make sure you have uploaded at least one PDF."
