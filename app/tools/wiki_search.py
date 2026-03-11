import wikipedia


def wiki_search(query: str) -> str:
    """Search Wikipedia for detailed encyclopedic information on a topic."""
    try:
        result = wikipedia.summary(query, sentences=5)
        return f"**Wikipedia Summary:**\n{result}"
    except wikipedia.exceptions.DisambiguationError as e:
        try:
            result = wikipedia.summary(e.options[0], sentences=5)
            return f"**Wikipedia Summary (closest match: {e.options[0]}):**\n{result}"
        except Exception:
            return f"Multiple matches found: {', '.join(e.options[:5])}. Please be more specific."
    except wikipedia.exceptions.PageError:
        return f"No Wikipedia page found for '{query}'."
    except Exception as e:
        return f"Wikipedia search error: {str(e)}"
