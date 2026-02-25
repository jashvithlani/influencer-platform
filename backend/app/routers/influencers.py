import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user, require_role
from app.models import Role, User
from app.schemas.influencer import InfluencerListResponse, InfluencerProfileResponse, InfluencerProfileUpdate
from app.services.influencer_service import get_influencer, get_influencer_by_user, list_influencers, update_influencer

router = APIRouter(prefix="/api/v1/influencers", tags=["influencers"])


@router.get("/", response_model=InfluencerListResponse)
async def list_all(
    db: Annotated[AsyncSession, Depends(get_db)],
    category: str | None = None,
    min_followers: int | None = None,
    max_followers: int | None = None,
    min_engagement: float | None = None,
    location: str | None = None,
    platform: str | None = None,
    sort_by: str = "follower_count",
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    items, total = await list_influencers(
        db, category, min_followers, max_followers, min_engagement, location, platform, sort_by, page, limit
    )
    return InfluencerListResponse(
        items=[InfluencerProfileResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/me", response_model=InfluencerProfileResponse)
async def get_my_profile(
    user: Annotated[User, Depends(require_role(Role.influencer))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    profile = await get_influencer_by_user(db, user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return InfluencerProfileResponse.model_validate(profile)


@router.put("/me", response_model=InfluencerProfileResponse)
async def update_my_profile(
    body: InfluencerProfileUpdate,
    user: Annotated[User, Depends(require_role(Role.influencer))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    profile = await get_influencer_by_user(db, user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    updated = await update_influencer(db, profile, body.model_dump(exclude_unset=True))
    return InfluencerProfileResponse.model_validate(updated)


@router.get("/me/applications")
async def my_applications(
    user: Annotated[User, Depends(require_role(Role.influencer))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    profile = await get_influencer_by_user(db, user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    from app.services.campaign_service import get_influencer_applications
    return await get_influencer_applications(db, profile.id)


@router.get("/{influencer_id}", response_model=InfluencerProfileResponse)
async def get_detail(
    influencer_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    profile = await get_influencer(db, influencer_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Influencer not found")
    return InfluencerProfileResponse.model_validate(profile)
