from __future__ import annotations

import enum
import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import Date, DateTime, Enum, Float, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.user import Base


class Platform(str, enum.Enum):
    instagram = "instagram"
    tiktok = "tiktok"
    youtube = "youtube"
    any = "any"


class CampaignStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    paused = "paused"
    completed = "completed"


class Campaign(Base):
    __tablename__ = "campaigns"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    brand_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("brand_profiles.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    requirements: Mapped[Optional[str]] = mapped_column(Text)
    budget: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2))
    price_per_influencer: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2))
    category: Mapped[Optional[str]] = mapped_column(String(50))
    min_followers: Mapped[Optional[int]] = mapped_column(Integer)
    min_engagement_rate: Mapped[Optional[float]] = mapped_column(Float)
    platform: Mapped[Platform] = mapped_column(Enum(Platform), default=Platform.any)
    status: Mapped[CampaignStatus] = mapped_column(Enum(CampaignStatus), default=CampaignStatus.draft)
    start_date: Mapped[Optional[date]] = mapped_column(Date)
    end_date: Mapped[Optional[date]] = mapped_column(Date)
    max_influencers: Mapped[Optional[int]] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    brand = relationship("BrandProfile", back_populates="campaigns")
    applications = relationship("CampaignApplication", back_populates="campaign")
