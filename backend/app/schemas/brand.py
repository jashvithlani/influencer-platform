from __future__ import annotations

import uuid

from pydantic import BaseModel


class BrandProfileResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    company_name: str
    logo_url: str | None = None
    industry: str | None = None
    website: str | None = None
    description: str | None = None

    model_config = {"from_attributes": True}


class BrandProfileUpdate(BaseModel):
    company_name: str | None = None
    logo_url: str | None = None
    industry: str | None = None
    website: str | None = None
    description: str | None = None
