import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import require_role
from app.models import BrandProfile, InfluencerProfile, Role, User
from app.schemas.brand import BrandProfileResponse, BrandProfileUpdate
from app.schemas.influencer import InfluencerProfileResponse

router = APIRouter(prefix="/api/v1/brands", tags=["brands"])

# Saved influencers association table - using raw SQL for simplicity
from sqlalchemy import Column, DateTime, ForeignKey, Table, func
from app.models.user import Base

saved_influencers = Table(
    "saved_influencers",
    Base.metadata,
    Column("brand_id", ForeignKey("brand_profiles.id"), primary_key=True),
    Column("influencer_id", ForeignKey("influencer_profiles.id"), primary_key=True),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
)


async def _get_brand_profile(db: AsyncSession, user_id: uuid.UUID) -> BrandProfile:
    result = await db.execute(select(BrandProfile).where(BrandProfile.user_id == user_id))
    brand = result.scalar_one_or_none()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand profile not found")
    return brand


@router.get("/me", response_model=BrandProfileResponse)
async def get_my_profile(
    user: Annotated[User, Depends(require_role(Role.brand))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand = await _get_brand_profile(db, user.id)
    return BrandProfileResponse.model_validate(brand)


@router.put("/me", response_model=BrandProfileResponse)
async def update_my_profile(
    body: BrandProfileUpdate,
    user: Annotated[User, Depends(require_role(Role.brand))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand = await _get_brand_profile(db, user.id)
    for key, value in body.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(brand, key, value)
    await db.flush()
    return BrandProfileResponse.model_validate(brand)


@router.get("/me/saved", response_model=list[InfluencerProfileResponse])
async def get_saved(
    user: Annotated[User, Depends(require_role(Role.brand))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand = await _get_brand_profile(db, user.id)
    result = await db.execute(
        select(InfluencerProfile)
        .join(saved_influencers, saved_influencers.c.influencer_id == InfluencerProfile.id)
        .where(saved_influencers.c.brand_id == brand.id)
    )
    influencers = result.scalars().all()
    return [InfluencerProfileResponse.model_validate(i) for i in influencers]


@router.post("/me/saved/{influencer_id}", status_code=status.HTTP_201_CREATED)
async def save_influencer(
    influencer_id: uuid.UUID,
    user: Annotated[User, Depends(require_role(Role.brand))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand = await _get_brand_profile(db, user.id)
    existing = await db.execute(
        select(saved_influencers).where(
            saved_influencers.c.brand_id == brand.id,
            saved_influencers.c.influencer_id == influencer_id,
        )
    )
    if existing.first():
        return {"detail": "Already saved"}
    await db.execute(saved_influencers.insert().values(brand_id=brand.id, influencer_id=influencer_id))
    return {"detail": "Saved"}


@router.delete("/me/saved/{influencer_id}")
async def unsave_influencer(
    influencer_id: uuid.UUID,
    user: Annotated[User, Depends(require_role(Role.brand))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand = await _get_brand_profile(db, user.id)
    await db.execute(
        delete(saved_influencers).where(
            saved_influencers.c.brand_id == brand.id,
            saved_influencers.c.influencer_id == influencer_id,
        )
    )
    return {"detail": "Removed"}
