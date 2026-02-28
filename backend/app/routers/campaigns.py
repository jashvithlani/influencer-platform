from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user, require_role
from app.models import BrandProfile, Role, User
from app.schemas.campaign import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationStatusUpdate,
    CampaignCreate,
    CampaignListResponse,
    CampaignResponse,
    CampaignUpdate,
)
from app.services.campaign_service import (
    apply_to_campaign,
    create_campaign,
    get_campaign,
    list_applications,
    list_campaigns,
    update_application_status,
    update_campaign,
)
from app.services.influencer_service import get_influencer_by_user

router = APIRouter(prefix="/api/v1/campaigns", tags=["campaigns"])


async def _get_brand_id(db: AsyncSession, user_id: uuid.UUID) -> uuid.UUID:
    result = await db.execute(select(BrandProfile).where(BrandProfile.user_id == user_id))
    brand = result.scalar_one_or_none()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand profile not found")
    return brand.id


@router.post("/", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def create(
    body: CampaignCreate,
    user: Annotated[User, Depends(require_role(Role.brand))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand_id = await _get_brand_id(db, user.id)
    campaign = await create_campaign(db, brand_id, body.model_dump())
    result = await get_campaign(db, campaign.id)
    return CampaignResponse(**result)


@router.get("/", response_model=CampaignListResponse)
async def list_all(
    db: Annotated[AsyncSession, Depends(get_db)],
    category: str | None = None,
    platform: str | None = None,
    status_filter: str | None = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    items, total = await list_campaigns(db, category=category, platform=platform, status=status_filter, page=page, limit=limit)
    return CampaignListResponse(
        items=[CampaignResponse(**c) for c in items],
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/mine", response_model=CampaignListResponse)
async def list_mine(
    user: Annotated[User, Depends(require_role(Role.brand))],
    db: Annotated[AsyncSession, Depends(get_db)],
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    brand_id = await _get_brand_id(db, user.id)
    items, total = await list_campaigns(db, brand_id=brand_id, status=None, page=page, limit=limit)
    return CampaignListResponse(
        items=[CampaignResponse(**c) for c in items],
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/{campaign_id}", response_model=CampaignResponse)
async def get_detail(
    campaign_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await get_campaign(db, campaign_id)
    if not result:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return CampaignResponse(**result)


@router.put("/{campaign_id}", response_model=CampaignResponse)
async def update(
    campaign_id: uuid.UUID,
    body: CampaignUpdate,
    user: Annotated[User, Depends(require_role(Role.brand))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand_id = await _get_brand_id(db, user.id)
    campaign = await update_campaign(db, campaign_id, brand_id, body.model_dump(exclude_unset=True))
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found or not owned by you")
    result = await get_campaign(db, campaign.id)
    return CampaignResponse(**result)


@router.post("/{campaign_id}/apply", response_model=ApplicationResponse)
async def apply(
    campaign_id: uuid.UUID,
    body: ApplicationCreate,
    user: Annotated[User, Depends(require_role(Role.influencer))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    profile = await get_influencer_by_user(db, user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Influencer profile not found")
    try:
        application = await apply_to_campaign(db, campaign_id, profile.id, body.pitch)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    return ApplicationResponse(
        id=application.id,
        campaign_id=application.campaign_id,
        influencer_id=application.influencer_id,
        status=application.status.value,
        pitch=application.pitch,
        created_at=application.created_at,
    )


@router.get("/{campaign_id}/applications", response_model=list[ApplicationResponse])
async def get_applications(
    campaign_id: uuid.UUID,
    user: Annotated[User, Depends(require_role(Role.brand))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand_id = await _get_brand_id(db, user.id)
    try:
        apps = await list_applications(db, campaign_id, brand_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return [ApplicationResponse(**a) for a in apps]


@router.put("/{campaign_id}/applications/{application_id}", response_model=ApplicationResponse)
async def update_app_status(
    campaign_id: uuid.UUID,
    application_id: uuid.UUID,
    body: ApplicationStatusUpdate,
    user: Annotated[User, Depends(require_role(Role.brand))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand_id = await _get_brand_id(db, user.id)
    application = await update_application_status(db, campaign_id, application_id, brand_id, body.status)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return ApplicationResponse(
        id=application.id,
        campaign_id=application.campaign_id,
        influencer_id=application.influencer_id,
        status=application.status.value,
        pitch=application.pitch,
        created_at=application.created_at,
    )
