import hashlib
import json
import logging
from typing import Any

from redis.asyncio import Redis

logger = logging.getLogger(__name__)


class CacheService:
    def __init__(self, redis: Redis | None, ttl_seconds: int) -> None:
        self._redis = redis
        self._ttl_seconds = ttl_seconds

    @staticmethod
    def list_key(params: dict[str, Any]) -> str:
        payload = json.dumps(params, sort_keys=True, default=str)
        digest = hashlib.sha256(payload.encode()).hexdigest()[:16]
        return f"products:list:{digest}"

    @staticmethod
    def detail_key(product_id: str) -> str:
        return f"products:detail:{product_id}"

    async def get(self, key: str) -> str | None:
        if self._redis is None:
            return None
        try:
            return await self._redis.get(key)
        except Exception:
            logger.warning("Redis GET failed for key %s", key, exc_info=True)
            return None

    async def set(self, key: str, value: str) -> None:
        if self._redis is None:
            return
        try:
            await self._redis.setex(key, self._ttl_seconds, value)
        except Exception:
            logger.warning("Redis SET failed for key %s", key, exc_info=True)
