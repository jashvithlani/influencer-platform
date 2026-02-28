from __future__ import annotations

import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel


class CampaignCreate(BaseModel):
    title: str
    description: str | None = None
    requirements: str | None = None
    budget: Decimal | None = None
    price_per_influencer: Decimal | None = None
    category: str | None = None
    min_followers: int | None = None
    min_engagement_rate: float | None = None
    platform: str = "any"
    status: str = "draft"
    start_date: date | None = None
    end_date: date | None = None
    max_influencers: int | None = None


class CampaignUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    requirements: str | None = None
    budget: Decimal | None = None
    price_per_influencer: Decimal | None = None
    category: str | None = None
    min_followers: int | None = None
    min_engagement_rate: float | None = None
    platform: str | None = None
    status: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    max_influencers: int | None = None


class CampaignResponse(BaseModel):
    id: uuid.UUID
    brand_id: uuid.UUID
    title: str
    description: str | None = None
    requirements: str | None = None
    budget: Decimal | None = None
    price_per_influencer: Decimal | None = None
    category: str | None = None
    min_followers: int | None = None
    min_engagement_rate: float | None = None
    platform: str
    status: str
    start_date: date | None = None
    end_date: date | None = None
    max_influencers: int | None = None
    created_at: datetime
    brand_name: str | None = None
    application_count: int | None = None

    model_config = {"from_attributes": True}


class CampaignListResponse(BaseModel):
    items: list[CampaignResponse]
    total: int
    page: int
    limit: int


class ApplicationCreate(BaseModel):
    pitch: str | None = None


class ApplicationResponse(BaseModel):
    id: uuid.UUID
    campaign_id: uuid.UUID
    influencer_id: uuid.UUID
    status: str
    pitch: str | None = None
    created_at: datetime
    influencer_name: str | None = None
    influencer_avatar: str | None = None
    campaign_title: str | None = None

    model_config = {"from_attributes": True}


class ApplicationStatusUpdate(BaseModel):
    status: str
