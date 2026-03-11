from duckduckgo_search import DDGS


def web_search(query: str) -> str:
    """Search the web using DuckDuckGo and return the top results."""
    try:
        results = []
        with DDGS() as ddgs:
            for item in ddgs.text(query, max_results=5):
                title = item.get("title", "")
                body = item.get("body", "")
                href = item.get("href", "")
                results.append(f"**{title}**\n{body}\nSource: {href}")

        if not results:
            return "No web results found for this query."

        return "\n\n---\n\n".join(results)
    except Exception as e:
        return f"Web search error: {str(e)}"
