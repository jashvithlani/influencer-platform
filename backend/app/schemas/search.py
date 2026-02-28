from __future__ import annotations

from pydantic import BaseModel

from app.schemas.influencer import InfluencerProfileResponse


class NaturalSearchRequest(BaseModel):
    query: str


class NaturalSearchResponse(BaseModel):
    query: str
    interpreted_filters: dict
    results: list[InfluencerProfileResponse]
    total: int


class RecommendationResponse(BaseModel):
    campaign_id: str
    recommendations: list[InfluencerProfileResponse]
    reasoning: str | None = None
