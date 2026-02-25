from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://platform:platform_secret@localhost:5432/influencer_platform"
    jwt_secret_key: str = "change-me-to-a-random-secret-key"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    openai_api_key: str = ""
    api_host: str = "0.0.0.0"
    api_port: int = 8000

    model_config = {"env_file": "../.env", "extra": "ignore"}


settings = Settings()
