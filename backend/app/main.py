from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, brands, campaigns, influencers, search


def create_app() -> FastAPI:
    application = FastAPI(
        title="Influencer Marketing Platform",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(auth.router)
    application.include_router(influencers.router)
    application.include_router(brands.router)
    application.include_router(campaigns.router)
    application.include_router(search.router)

    @application.get("/health")
    async def health():
        return {"status": "ok"}

    return application


app = create_app()
