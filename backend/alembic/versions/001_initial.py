"""initial migration

Revision ID: 001
Revises:
Create Date: 2026-02-25
"""
from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Users
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), unique=True, index=True, nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("role", sa.Enum("brand", "influencer", name="role"), nullable=False),
        sa.Column("is_active", sa.Boolean(), default=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Influencer profiles
    op.create_table(
        "influencer_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), unique=True, nullable=False),
        sa.Column("display_name", sa.String(100), nullable=False),
        sa.Column("bio", sa.Text()),
        sa.Column("avatar_url", sa.String(500)),
        sa.Column("categories", postgresql.ARRAY(sa.String())),
        sa.Column("instagram_handle", sa.String(100)),
        sa.Column("tiktok_handle", sa.String(100)),
        sa.Column("youtube_handle", sa.String(100)),
        sa.Column("follower_count", sa.Integer(), default=0),
        sa.Column("engagement_rate", sa.Float(), default=0.0),
        sa.Column("avg_likes", sa.Integer(), default=0),
        sa.Column("avg_comments", sa.Integer(), default=0),
        sa.Column("audience_top_country", sa.String(2)),
        sa.Column("audience_age_range", sa.String(10)),
        sa.Column("audience_gender_split", postgresql.JSONB()),
        sa.Column("authenticity_score", sa.Float(), default=0.0),
        sa.Column("fake_follower_pct", sa.Float(), default=0.0),
        sa.Column("price_per_post", sa.Numeric(10, 2)),
        sa.Column("location", sa.String(100)),
        sa.Column("is_verified", sa.Boolean(), default=False),
    )

    # Brand profiles
    op.create_table(
        "brand_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), unique=True, nullable=False),
        sa.Column("company_name", sa.String(200), nullable=False),
        sa.Column("logo_url", sa.String(500)),
        sa.Column("industry", sa.String(100)),
        sa.Column("website", sa.String(500)),
        sa.Column("description", sa.Text()),
    )

    # Campaigns
    op.create_table(
        "campaigns",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("brand_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("brand_profiles.id"), nullable=False),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("requirements", sa.Text()),
        sa.Column("budget", sa.Numeric(12, 2)),
        sa.Column("price_per_influencer", sa.Numeric(10, 2)),
        sa.Column("category", sa.String(50)),
        sa.Column("min_followers", sa.Integer()),
        sa.Column("min_engagement_rate", sa.Float()),
        sa.Column("platform", sa.Enum("instagram", "tiktok", "youtube", "any", name="platform"), default="any"),
        sa.Column("status", sa.Enum("draft", "active", "paused", "completed", name="campaignstatus"), default="draft"),
        sa.Column("start_date", sa.Date()),
        sa.Column("end_date", sa.Date()),
        sa.Column("max_influencers", sa.Integer()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Campaign applications
    op.create_table(
        "campaign_applications",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("campaign_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("campaigns.id"), nullable=False),
        sa.Column("influencer_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("influencer_profiles.id"), nullable=False),
        sa.Column("status", sa.Enum("pending", "accepted", "rejected", name="applicationstatus"), default="pending"),
        sa.Column("pitch", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("campaign_id", "influencer_id"),
    )

    # Saved influencers
    op.create_table(
        "saved_influencers",
        sa.Column("brand_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("brand_profiles.id"), primary_key=True),
        sa.Column("influencer_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("influencer_profiles.id"), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("saved_influencers")
    op.drop_table("campaign_applications")
    op.drop_table("campaigns")
    op.drop_table("brand_profiles")
    op.drop_table("influencer_profiles")
    op.drop_table("users")
    op.execute("DROP TYPE IF EXISTS role")
    op.execute("DROP TYPE IF EXISTS platform")
    op.execute("DROP TYPE IF EXISTS campaignstatus")
    op.execute("DROP TYPE IF EXISTS applicationstatus")
