from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.destinations import router as destinations_router
from app.api.users import router as users_router
from app.api.challenges import router as challenges_router
from app.db.database import create_indexes
from contextlib import asynccontextmanager
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic: Create database indexes
    await create_indexes()
    yield
    # Shutdown logic (if any) -  Motor usually handles connection closing automatically


app = FastAPI(title="Globetrotter API", description="API for the Globetrotter travel quiz game", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # For production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(destinations_router, prefix="/api/destinations", tags=["destinations"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(challenges_router, prefix="/api/challenges", tags=["challenges"])


@app.get("/")
async def root():
    return {"message": "Welcome to the Globetrotter API"}