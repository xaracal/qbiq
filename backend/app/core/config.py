from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "qbiq"
    redis_url: str = "redis://localhost:6379"
    cache_ttl_seconds: int = 300
    cart_session_ttl_seconds: int = 86400
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:80"]


settings = Settings()
