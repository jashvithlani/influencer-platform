import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas.influencer import InfluencerProfileResponse
from app.schemas.search import NaturalSearchRequest, NaturalSearchResponse, RecommendationResponse
from app.services.search_service import get_recommendations, natural_search

router = APIRouter(prefix="/api/v1/search", tags=["search"])


@router.post("/natural", response_model=NaturalSearchResponse)
async def search_natural(
    body: NaturalSearchRequest,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await natural_search(db, body.query)
    return NaturalSearchResponse(
        query=result["query"],
        interpreted_filters=result["interpreted_filters"],
        results=[InfluencerProfileResponse.model_validate(i) for i in result["results"]],
        total=result["total"],
    )


@router.get("/recommendations/{campaign_id}", response_model=RecommendationResponse)
async def recommendations(
    campaign_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    try:
        result = await get_recommendations(db, campaign_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return RecommendationResponse(
        campaign_id=result["campaign_id"],
        recommendations=[InfluencerProfileResponse.model_validate(i) for i in result["recommendations"]],
        reasoning=result["reasoning"],
    )
