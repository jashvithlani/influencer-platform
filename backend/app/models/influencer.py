from __future__ import annotations

import uuid
from decimal import Decimal
from typing import Optional

from sqlalchemy import Boolean, Float, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.user import Base


class InfluencerProfile(Base):
    __tablename__ = "influencer_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    bio: Mapped[Optional[str]] = mapped_column(Text)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500))
    categories: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String))
    instagram_handle: Mapped[Optional[str]] = mapped_column(String(100))
    tiktok_handle: Mapped[Optional[str]] = mapped_column(String(100))
    youtube_handle: Mapped[Optional[str]] = mapped_column(String(100))
    follower_count: Mapped[int] = mapped_column(Integer, default=0)
    engagement_rate: Mapped[float] = mapped_column(Float, default=0.0)
    avg_likes: Mapped[int] = mapped_column(Integer, default=0)
    avg_comments: Mapped[int] = mapped_column(Integer, default=0)
    audience_top_country: Mapped[Optional[str]] = mapped_column(String(2))
    audience_age_range: Mapped[Optional[str]] = mapped_column(String(10))
    audience_gender_split: Mapped[Optional[dict]] = mapped_column(JSONB)
    authenticity_score: Mapped[float] = mapped_column(Float, default=0.0)
    fake_follower_pct: Mapped[float] = mapped_column(Float, default=0.0)
    price_per_post: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2))
    location: Mapped[Optional[str]] = mapped_column(String(100))
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    user = relationship("User", back_populates="influencer_profile")
    applications = relationship("CampaignApplication", back_populates="influencer")
