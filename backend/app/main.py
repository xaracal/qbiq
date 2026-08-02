from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes.cart import router as cart_router
from app.api.routes.products import router as products_router
from app.core.config import settings
from app.db.lifespan import lifespan
app = FastAPI(title="QBIQ Dig Store API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router)
app.include_router(cart_router)


@app.get("/health")
async def health(request: Request) -> JSONResponse:
    mongo_ok = False
    redis_ok = False

    mongo_client = getattr(request.app.state, "mongo_client", None)
    if mongo_client is not None:
        try:
            await mongo_client.admin.command("ping")
            mongo_ok = True
        except Exception:
            mongo_ok = False

    redis_client = getattr(request.app.state, "redis_client", None)
    if redis_client is not None:
        try:
            await redis_client.ping()
            redis_ok = True
        except Exception:
            redis_ok = False

    status = "ok" if mongo_ok else "degraded"
    code = 200 if mongo_ok else 503
    return JSONResponse(
        status_code=code,
        content={
            "status": status,
            "mongo": "ok" if mongo_ok else "unavailable",
            "redis": "ok" if redis_ok else "unavailable",
        },
    )
