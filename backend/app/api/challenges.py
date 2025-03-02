import uuid
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.database import get_db
from app.schemas.challenge import ChallengeCreate, Challenge

router = APIRouter()

@router.post("/", response_model=Challenge)
async def create_challenge(
    challenge: ChallengeCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new challenge link"""
    # Check if user exists
    user = await db["users"].find_one({"username": challenge.challenger_username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create a new challenge
    challenge_code = str(uuid.uuid4())[:8]  # Use first 8 chars of a UUID for readability
    challenge_doc = {
        "challenger_id": user["_id"],
        "challenge_code": challenge_code,
        "created_at": datetime.utcnow()
    }
    result = await db["challenges"].insert_one(challenge_doc)
    created_challenge = await db["challenges"].find_one({"_id": result.inserted_id})
    
    return Challenge(
        id=str(created_challenge["_id"]),
        challenge_code=created_challenge["challenge_code"],
        challenger_username=user["username"],
        challenger_score=user["score"],
        created_at=created_challenge["created_at"]
    )

@router.get("/{challenge_code}", response_model=Challenge)
async def get_challenge(
    challenge_code: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get challenge details by challenge code"""
    challenge_doc = await db["challenges"].find_one({"challenge_code": challenge_code})
    if not challenge_doc:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    user = await db["users"].find_one({"_id": challenge_doc["challenger_id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return Challenge(
        id=str(challenge_doc["_id"]),
        challenge_code=challenge_doc["challenge_code"],
        challenger_username=user["username"],
        challenger_score=user["score"],
        created_at=challenge_doc["created_at"]
    )