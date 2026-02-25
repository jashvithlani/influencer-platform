import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Campaign, InfluencerProfile
from app.services.ai_service import interpret_search_query, recommend_influencers_for_campaign


async def natural_search(db: AsyncSession, query: str) -> dict:
    filters = await interpret_search_query(query)

    stmt = select(InfluencerProfile)

    if filters.get("category"):
        stmt = stmt.where(InfluencerProfile.categories.any(filters["category"]))
    if filters.get("min_followers"):
        stmt = stmt.where(InfluencerProfile.follower_count >= filters["min_followers"])
    if filters.get("max_followers"):
        stmt = stmt.where(InfluencerProfile.follower_count <= filters["max_followers"])
    if filters.get("min_engagement"):
        stmt = stmt.where(InfluencerProfile.engagement_rate >= filters["min_engagement"])
    if filters.get("location"):
        stmt = stmt.where(InfluencerProfile.location.ilike(f"%{filters['location']}%"))
    if filters.get("platform") == "instagram":
        stmt = stmt.where(InfluencerProfile.instagram_handle.isnot(None))
    elif filters.get("platform") == "tiktok":
        stmt = stmt.where(InfluencerProfile.tiktok_handle.isnot(None))
    elif filters.get("platform") == "youtube":
        stmt = stmt.where(InfluencerProfile.youtube_handle.isnot(None))
    if filters.get("min_authenticity"):
        stmt = stmt.where(InfluencerProfile.authenticity_score >= filters["min_authenticity"])

    count_q = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_q)).scalar()

    stmt = stmt.order_by(InfluencerProfile.follower_count.desc()).limit(20)
    result = await db.execute(stmt)
    influencers = result.scalars().all()

    return {
        "query": query,
        "interpreted_filters": filters,
        "results": influencers,
        "total": total,
    }


async def get_recommendations(db: AsyncSession, campaign_id: uuid.UUID) -> dict:
    campaign_result = await db.execute(select(Campaign).where(Campaign.id == campaign_id))
    campaign = campaign_result.scalar_one_or_none()
    if not campaign:
        raise ValueError("Campaign not found")

    stmt = select(InfluencerProfile)
    if campaign.category:
        stmt = stmt.where(InfluencerProfile.categories.any(campaign.category))
    if campaign.min_followers:
        stmt = stmt.where(InfluencerProfile.follower_count >= campaign.min_followers)
    if campaign.min_engagement_rate:
        stmt = stmt.where(InfluencerProfile.engagement_rate >= campaign.min_engagement_rate)

    stmt = stmt.where(InfluencerProfile.authenticity_score >= 70)
    stmt = stmt.order_by(InfluencerProfile.engagement_rate.desc()).limit(10)

    result = await db.execute(stmt)
    influencers = result.scalars().all()

    reasoning = await recommend_influencers_for_campaign(
        campaign_title=campaign.title,
        campaign_category=campaign.category,
        influencer_names=[i.display_name for i in influencers],
    )

    return {
        "campaign_id": str(campaign_id),
        "recommendations": influencers,
        "reasoning": reasoning,
    }
