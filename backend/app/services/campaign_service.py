from __future__ import annotations

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import BrandProfile, Campaign, CampaignApplication, CampaignStatus, InfluencerProfile, Platform


async def create_campaign(db: AsyncSession, brand_id: uuid.UUID, data: dict) -> Campaign:
    platform = data.pop("platform", "any")
    status = data.pop("status", "draft")
    campaign = Campaign(brand_id=brand_id, platform=Platform(platform), status=CampaignStatus(status), **data)
    db.add(campaign)
    await db.flush()
    return campaign


async def list_campaigns(
    db: AsyncSession,
    brand_id: uuid.UUID | None = None,
    category: str | None = None,
    platform: str | None = None,
    status: str | None = None,
    page: int = 1,
    limit: int = 20,
) -> tuple[list[dict], int]:
    query = select(Campaign, BrandProfile.company_name).join(
        BrandProfile, Campaign.brand_id == BrandProfile.id
    )

    if brand_id:
        query = query.where(Campaign.brand_id == brand_id)
    if category:
        query = query.where(Campaign.category == category)
    if platform:
        query = query.where(Campaign.platform == Platform(platform))
    if status:
        query = query.where(Campaign.status == CampaignStatus(status))
    elif not brand_id:
        query = query.where(Campaign.status == CampaignStatus.active)

    count_q = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_q)).scalar()

    query = query.order_by(Campaign.created_at.desc()).offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    rows = result.all()

    campaigns = []
    for campaign, brand_name in rows:
        app_count_q = select(func.count()).where(CampaignApplication.campaign_id == campaign.id)
        app_count = (await db.execute(app_count_q)).scalar()
        campaigns.append({
            **{c.key: getattr(campaign, c.key) for c in Campaign.__table__.columns},
            "platform": campaign.platform.value,
            "status": campaign.status.value,
            "brand_name": brand_name,
            "application_count": app_count,
        })

    return campaigns, total


async def get_campaign(db: AsyncSession, campaign_id: uuid.UUID) -> dict | None:
    result = await db.execute(
        select(Campaign, BrandProfile.company_name)
        .join(BrandProfile, Campaign.brand_id == BrandProfile.id)
        .where(Campaign.id == campaign_id)
    )
    row = result.first()
    if not row:
        return None
    campaign, brand_name = row
    app_count = (await db.execute(
        select(func.count()).where(CampaignApplication.campaign_id == campaign.id)
    )).scalar()
    return {
        **{c.key: getattr(campaign, c.key) for c in Campaign.__table__.columns},
        "platform": campaign.platform.value,
        "status": campaign.status.value,
        "brand_name": brand_name,
        "application_count": app_count,
    }


async def update_campaign(db: AsyncSession, campaign_id: uuid.UUID, brand_id: uuid.UUID, data: dict) -> Campaign | None:
    result = await db.execute(select(Campaign).where(Campaign.id == campaign_id, Campaign.brand_id == brand_id))
    campaign = result.scalar_one_or_none()
    if not campaign:
        return None
    for key, value in data.items():
        if value is not None:
            if key == "platform":
                setattr(campaign, key, Platform(value))
            elif key == "status":
                setattr(campaign, key, CampaignStatus(value))
            else:
                setattr(campaign, key, value)
    await db.flush()
    return campaign


async def apply_to_campaign(
    db: AsyncSession, campaign_id: uuid.UUID, influencer_id: uuid.UUID, pitch: str | None = None
) -> CampaignApplication:
    existing = await db.execute(
        select(CampaignApplication).where(
            CampaignApplication.campaign_id == campaign_id,
            CampaignApplication.influencer_id == influencer_id,
        )
    )
    if existing.scalar_one_or_none():
        raise ValueError("Already applied to this campaign")

    application = CampaignApplication(
        campaign_id=campaign_id,
        influencer_id=influencer_id,
        pitch=pitch,
    )
    db.add(application)
    await db.flush()
    return application


async def list_applications(
    db: AsyncSession, campaign_id: uuid.UUID, brand_id: uuid.UUID
) -> list[dict]:
    campaign_check = await db.execute(
        select(Campaign).where(Campaign.id == campaign_id, Campaign.brand_id == brand_id)
    )
    if not campaign_check.scalar_one_or_none():
        raise ValueError("Campaign not found or not owned by you")

    result = await db.execute(
        select(CampaignApplication, InfluencerProfile.display_name, InfluencerProfile.avatar_url)
        .join(InfluencerProfile, CampaignApplication.influencer_id == InfluencerProfile.id)
        .where(CampaignApplication.campaign_id == campaign_id)
        .order_by(CampaignApplication.created_at.desc())
    )
    rows = result.all()
    return [
        {
            "id": app.id,
            "campaign_id": app.campaign_id,
            "influencer_id": app.influencer_id,
            "status": app.status.value,
            "pitch": app.pitch,
            "created_at": app.created_at,
            "influencer_name": name,
            "influencer_avatar": avatar,
        }
        for app, name, avatar in rows
    ]


async def update_application_status(
    db: AsyncSession, campaign_id: uuid.UUID, application_id: uuid.UUID, brand_id: uuid.UUID, status: str
) -> CampaignApplication | None:
    campaign_check = await db.execute(
        select(Campaign).where(Campaign.id == campaign_id, Campaign.brand_id == brand_id)
    )
    if not campaign_check.scalar_one_or_none():
        return None

    from app.models import ApplicationStatus
    result = await db.execute(
        select(CampaignApplication).where(CampaignApplication.id == application_id)
    )
    application = result.scalar_one_or_none()
    if not application:
        return None
    application.status = ApplicationStatus(status)
    await db.flush()
    return application


async def get_influencer_applications(db: AsyncSession, influencer_id: uuid.UUID) -> list[dict]:
    result = await db.execute(
        select(CampaignApplication, Campaign.title)
        .join(Campaign, CampaignApplication.campaign_id == Campaign.id)
        .where(CampaignApplication.influencer_id == influencer_id)
        .order_by(CampaignApplication.created_at.desc())
    )
    rows = result.all()
    return [
        {
            "id": app.id,
            "campaign_id": app.campaign_id,
            "influencer_id": app.influencer_id,
            "status": app.status.value,
            "pitch": app.pitch,
            "created_at": app.created_at,
            "campaign_title": title,
        }
        for app, title in rows
    ]
