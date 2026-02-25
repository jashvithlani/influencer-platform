import json
import logging

from app.config import settings

logger = logging.getLogger(__name__)


async def interpret_search_query(query: str) -> dict:
    """Use AI to interpret a natural language search into structured filters."""
    if settings.openai_api_key:
        try:
            return await _openai_interpret(query)
        except Exception as e:
            logger.warning(f"OpenAI call failed, using mock: {e}")

    return _mock_interpret(query)


async def _openai_interpret(query: str) -> dict:
    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=settings.openai_api_key)
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You extract search filters from natural language queries about influencers. "
                    "Return a JSON object with these optional keys: "
                    "category (string), min_followers (int), max_followers (int), "
                    "min_engagement (float 0-1), location (string), platform (instagram|tiktok|youtube), "
                    "min_authenticity (float 0-100). Only include keys that are mentioned or implied."
                ),
            },
            {"role": "user", "content": query},
        ],
        response_format={"type": "json_object"},
        temperature=0,
    )
    return json.loads(response.choices[0].message.content)


def _mock_interpret(query: str) -> dict:
    """Rule-based fallback for search interpretation."""
    query_lower = query.lower()
    filters = {}

    categories = ["fashion", "beauty", "fitness", "food", "travel", "tech", "gaming", "lifestyle", "music", "sports"]
    for cat in categories:
        if cat in query_lower:
            filters["category"] = cat
            break

    if "micro" in query_lower:
        filters["min_followers"] = 10000
        filters["max_followers"] = 100000
    elif "macro" in query_lower or "big" in query_lower:
        filters["min_followers"] = 500000
    elif "nano" in query_lower:
        filters["min_followers"] = 1000
        filters["max_followers"] = 10000

    follower_keywords = {
        "10k": 10000, "50k": 50000, "100k": 100000,
        "500k": 500000, "1m": 1000000, "1 million": 1000000,
    }
    for keyword, value in follower_keywords.items():
        if keyword in query_lower:
            if any(w in query_lower for w in ["over", "above", "more than", "at least"]):
                filters["min_followers"] = value
            elif any(w in query_lower for w in ["under", "below", "less than"]):
                filters["max_followers"] = value

    if "high engagement" in query_lower or "engaged" in query_lower:
        filters["min_engagement"] = 0.03
    if "authentic" in query_lower or "real" in query_lower or "genuine" in query_lower:
        filters["min_authenticity"] = 80

    platforms = ["instagram", "tiktok", "youtube"]
    for plat in platforms:
        if plat in query_lower:
            filters["platform"] = plat
            break

    locations = {
        "us": "US", "usa": "US", "united states": "US",
        "uk": "UK", "india": "IN", "brazil": "BR",
        "los angeles": "Los Angeles", "new york": "New York",
        "london": "London", "mumbai": "Mumbai",
    }
    for keyword, loc in locations.items():
        if keyword in query_lower:
            filters["location"] = loc
            break

    return filters


async def recommend_influencers_for_campaign(
    campaign_title: str, campaign_category: str | None, influencer_names: list[str]
) -> str:
    """Generate AI reasoning for why these influencers are recommended."""
    if settings.openai_api_key:
        try:
            return await _openai_recommend(campaign_title, campaign_category, influencer_names)
        except Exception as e:
            logger.warning(f"OpenAI call failed, using mock: {e}")

    return _mock_recommend(campaign_title, campaign_category, influencer_names)


async def _openai_recommend(
    campaign_title: str, campaign_category: str | None, influencer_names: list[str]
) -> str:
    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=settings.openai_api_key)
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You provide brief explanations for why influencers are recommended for marketing campaigns. Keep it to 2-3 sentences.",
            },
            {
                "role": "user",
                "content": f"Campaign: {campaign_title} (Category: {campaign_category}). Recommended influencers: {', '.join(influencer_names)}. Why are they a good fit?",
            },
        ],
        temperature=0.7,
        max_tokens=200,
    )
    return response.choices[0].message.content


def _mock_recommend(
    campaign_title: str, campaign_category: str | None, influencer_names: list[str]
) -> str:
    names = ", ".join(influencer_names[:3])
    extra = f" in the {campaign_category} space" if campaign_category else ""
    return (
        f"These influencers are recommended for '{campaign_title}' based on their strong engagement rates, "
        f"audience alignment{extra}, and high authenticity scores. "
        f"{names} have demonstrated consistent content quality and audience trust."
    )
