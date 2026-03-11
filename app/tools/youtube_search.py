import json
import urllib.request
import urllib.parse


def youtube_search(query: str) -> str:
    """Search YouTube for relevant videos on a topic using the YouTube oEmbed/search workaround."""
    try:
        # Use a lightweight HTTP-based search instead of youtubesearchpython
        # which has httpx compatibility issues with the 'proxies' argument
        encoded_query = urllib.parse.quote(query)
        url = f"https://www.youtube.com/results?search_query={encoded_query}"
        
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                ),
                "Accept-Language": "en-US,en;q=0.9",
            },
        )
        
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode("utf-8", errors="replace")
        
        # Extract video data from YouTube's initial data JSON
        videos = _extract_videos_from_html(html)
        
        if not videos:
            return "No YouTube videos found for this query."
        
        formatted = []
        for video in videos[:5]:
            title = video.get("title", "Unknown")
            video_id = video.get("videoId", "")
            link = f"https://www.youtube.com/watch?v={video_id}" if video_id else ""
            channel = video.get("channel", "Unknown")
            views = video.get("views", "N/A")
            duration = video.get("duration", "N/A")
            formatted.append(
                f"[VIDEO] **{title}**\n"
                f"Channel: {channel} | Duration: {duration} | Views: {views}\n"
                f"Link: {link}"
            )
        
        return "\n\n".join(formatted)
    except Exception as e:
        return f"YouTube search error: {str(e)}"


def _extract_videos_from_html(html: str) -> list[dict]:
    """Parse YouTube search results HTML to extract video info."""
    videos = []
    
    # Find the ytInitialData JSON block
    marker = "var ytInitialData = "
    start = html.find(marker)
    if start == -1:
        return videos
    
    start += len(marker)
    end = html.find(";</script>", start)
    if end == -1:
        return videos
    
    try:
        data = json.loads(html[start:end])
    except json.JSONDecodeError:
        return videos
    
    try:
        contents = (
            data["contents"]["twoColumnSearchResultsRenderer"]
            ["primaryContents"]["sectionListRenderer"]["contents"][0]
            ["itemSectionRenderer"]["contents"]
        )
    except (KeyError, IndexError):
        return videos
    
    for item in contents:
        renderer = item.get("videoRenderer")
        if not renderer:
            continue
        
        title_runs = renderer.get("title", {}).get("runs", [])
        title = title_runs[0].get("text", "Unknown") if title_runs else "Unknown"
        video_id = renderer.get("videoId", "")
        
        channel_runs = (
            renderer.get("ownerText", {}).get("runs", [])
            or renderer.get("longBylineText", {}).get("runs", [])
        )
        channel = channel_runs[0].get("text", "Unknown") if channel_runs else "Unknown"
        
        view_count_text = renderer.get("viewCountText", {}).get("simpleText", "N/A")
        duration_text = renderer.get("lengthText", {}).get("simpleText", "N/A")
        
        videos.append({
            "title": title,
            "videoId": video_id,
            "channel": channel,
            "views": view_count_text,
            "duration": duration_text,
        })
    
    return videos
