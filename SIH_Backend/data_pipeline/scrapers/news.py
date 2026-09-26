import urllib.parse
import xml.etree.ElementTree as ET

import curl_cffi
from googlenewsdecoder import gnewsdecoder

RSS_BASE = "https://news.google.com/rss/search"
HEADERS = {"User-Agent": "Mozilla/5.0"}

NEG_WORDS = ("scam", "misuse", "embezzle", "kickback", "fir", "probe", "irregular",
             "blacklist", "siphon", "fraud", "corrupt", "arrest", "raid", "scanner")
POS_WORDS = ("inaugurat", "foundation stone", "completed", "launched", "flagged off")


def _tag_sentiment(title):
    t = (title or "").lower()
    if any(k in t for k in NEG_WORDS):
        return "negative"
    if any(k in t for k in POS_WORDS):
        return "positive"
    return "neutral"


def fetch_news(mp_name, constituency, state, project_name):
    """Search news for one work. MP name + location anchor the query (real MPLADS
    coverage is written at that level); project_name is added as plain keywords
    to narrow it down."""
    location = constituency or state
    query = f'"{mp_name}" "{location}" {project_name} MPLADS'
    url = f"{RSS_BASE}?q={urllib.parse.quote(query)}&hl=en-IN&gl=IN&ceid=IN:en"

    response = curl_cffi.get(url, impersonate="chrome123", headers=HEADERS, timeout=30)
    root = ET.fromstring(response.content)
    items = [
        {
            "title": item.findtext("title"),
            "link": item.findtext("link"),
            "source": item.findtext("source"),
            "published_at": item.findtext("pubDate"),
        }
        for item in root.findall("./channel/item")
    ]
    if not items:
        return []

    decoded = gnewsdecoder([it["link"] for it in items], interval=1)
    if isinstance(decoded, dict):
        decoded = [decoded]

    return [
        {
            "mp_name": mp_name,
            "constituency": constituency,
            "state": state,
            "title": it["title"],
            "url": dec["decoded_url"] if dec.get("success") else it["link"],
            "source": it["source"],
            "published_at": it["published_at"],
            "sentiment": _tag_sentiment(it["title"]),
        }
        for it, dec in zip(items, decoded)
    ]


if __name__ == "__main__":
    results = fetch_news("Rahul Gandhi", "Wayanad", "Kerala", "railway platform shelter")
    print(f"{len(results)} items found")
    for r in results:
        print(r)
