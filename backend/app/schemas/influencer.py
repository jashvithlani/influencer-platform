import uuid
from decimal import Decimal

from pydantic import BaseModel


class InfluencerProfileResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    display_name: str
    bio: str | None = None
    avatar_url: str | None = None
    categories: list[str] | None = None
    instagram_handle: str | None = None
    tiktok_handle: str | None = None
    youtube_handle: str | None = None
    follower_count: int = 0
    engagement_rate: float = 0.0
    avg_likes: int = 0
    avg_comments: int = 0
    audience_top_country: str | None = None
    audience_age_range: str | None = None
    audience_gender_split: dict | None = None
    authenticity_score: float = 0.0
    fake_follower_pct: float = 0.0
    price_per_post: Decimal | None = None
    location: str | None = None
    is_verified: bool = False

    model_config = {"from_attributes": True}


class InfluencerProfileUpdate(BaseModel):
    display_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    categories: list[str] | None = None
    instagram_handle: str | None = None
    tiktok_handle: str | None = None
    youtube_handle: str | None = None
    follower_count: int | None = None
    engagement_rate: float | None = None
    avg_likes: int | None = None
    avg_comments: int | None = None
    audience_top_country: str | None = None
    audience_age_range: str | None = None
    audience_gender_split: dict | None = None
    price_per_post: Decimal | None = None
    location: str | None = None


class InfluencerListResponse(BaseModel):
    items: list[InfluencerProfileResponse]
    total: int
    page: int
    limit: int
