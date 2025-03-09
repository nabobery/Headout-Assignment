import uuid
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.database import get_db
from app.schemas.challenge import ChallengeCreate, Challenge
import random
import string

router = APIRouter()

def generate_challenge_code(length=6):
    """Generate a random challenge code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

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
    
    # Generate a unique challenge code
    challenge_code = generate_challenge_code()
    while await db["challenges"].find_one({"challenge_code": challenge_code}):
        challenge_code = generate_challenge_code()
    
    # Create a new challenge
    challenge_doc = {
        "challenger_id": user["_id"],
        "challenge_code": challenge_code,
        "created_at": datetime.now(),
        "score": user.get("score", 0),
        "status": "pending",
        "expires_at": datetime.now() + timedelta(days=7)  # Challenge expires in 7 days
    }
    result = await db["challenges"].insert_one(challenge_doc)
    created_challenge = await db["challenges"].find_one({"_id": result.inserted_id})
    
    return Challenge(
        id=str(created_challenge["_id"]),
        challenge_code=created_challenge["challenge_code"],
        challenger_username=user["username"],
        challenger_score=user["score"],
        status="pending",
        created_at=created_challenge["created_at"],
        expires_at=created_challenge["expires_at"]
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
    
    # Check if challenge has expired
    if challenge_doc.get("expires_at") and challenge_doc["expires_at"] < datetime.now():
        await db["challenges"].update_one(
            {"_id": challenge_doc["_id"]},
            {"$set": {"status": "expired"}}
        )
        challenge_doc["status"] = "expired"
    
    user = await db["users"].find_one({"_id": challenge_doc["challenger_id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return Challenge(
        id=str(challenge_doc["_id"]),
        challenge_code=challenge_doc["challenge_code"],
        challenger_username=user["username"],
        challenger_score=user["score"],
        status="pending",
        created_at=challenge_doc["created_at"],
        expires_at=challenge_doc["expires_at"]
    )

@router.get("/user/{username}", response_model=list[Challenge])
async def get_user_challenges(username: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    cursor = db["challenges"].find({
        "$or": [
            {"challenger_username": username},
            {"to_username": username}
        ]
    }).sort("created_at", -1)
    
    challenges = await cursor.to_list(length=100)
    return [Challenge(**challenge) for challenge in challenges]