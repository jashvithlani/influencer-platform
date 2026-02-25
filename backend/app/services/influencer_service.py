import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import InfluencerProfile


async def list_influencers(
    db: AsyncSession,
    category: str | None = None,
    min_followers: int | None = None,
    max_followers: int | None = None,
    min_engagement: float | None = None,
    location: str | None = None,
    platform: str | None = None,
    sort_by: str = "follower_count",
    page: int = 1,
    limit: int = 20,
) -> tuple[list[InfluencerProfile], int]:
    query = select(InfluencerProfile)

    if category:
        query = query.where(InfluencerProfile.categories.any(category))
    if min_followers is not None:
        query = query.where(InfluencerProfile.follower_count >= min_followers)
    if max_followers is not None:
        query = query.where(InfluencerProfile.follower_count <= max_followers)
    if min_engagement is not None:
        query = query.where(InfluencerProfile.engagement_rate >= min_engagement)
    if location:
        query = query.where(InfluencerProfile.location.ilike(f"%{location}%"))
    if platform:
        if platform == "instagram":
            query = query.where(InfluencerProfile.instagram_handle.isnot(None))
        elif platform == "tiktok":
            query = query.where(InfluencerProfile.tiktok_handle.isnot(None))
        elif platform == "youtube":
            query = query.where(InfluencerProfile.youtube_handle.isnot(None))

    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    sort_column = getattr(InfluencerProfile, sort_by, InfluencerProfile.follower_count)
    query = query.order_by(sort_column.desc()).offset((page - 1) * limit).limit(limit)

    result = await db.execute(query)
    return result.scalars().all(), total


async def get_influencer(db: AsyncSession, influencer_id: uuid.UUID) -> InfluencerProfile | None:
    result = await db.execute(select(InfluencerProfile).where(InfluencerProfile.id == influencer_id))
    return result.scalar_one_or_none()


async def get_influencer_by_user(db: AsyncSession, user_id: uuid.UUID) -> InfluencerProfile | None:
    result = await db.execute(select(InfluencerProfile).where(InfluencerProfile.user_id == user_id))
    return result.scalar_one_or_none()


async def update_influencer(db: AsyncSession, profile: InfluencerProfile, data: dict) -> InfluencerProfile:
    for key, value in data.items():
        if value is not None:
            setattr(profile, key, value)
    await db.flush()
    return profile
