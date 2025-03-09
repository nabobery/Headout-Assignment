from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.database import get_db
from app.schemas.user import UserCreate, UserOut, UserScore, LeaderboardEntry
from typing import List

router = APIRouter()

@router.post("/", response_model=UserOut)
async def create_user(user: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    exists = await db["users"].find_one({"username": user.username})
    if exists:
        # If user exists, just return the existing user
        return UserOut(**exists)
    
    user_doc = user.model_dump()
    user_doc["created_at"] = datetime.now()
    user_doc["score"] = 0
    user_doc["correct_answers"] = 0
    user_doc["incorrect_answers"] = 0
    result = await db["users"].insert_one(user_doc)
    new_user = await db["users"].find_one({"_id": result.inserted_id})
    return UserOut(**new_user)

@router.get("/{username}", response_model=UserOut)
async def get_user(username: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    user = await db["users"].find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(**user)

# @router.post("/{username}/score", response_model=UserOut)
# async def update_user_score_endpoint(username: str, score: UserScore, db: AsyncIOMotorDatabase = Depends(get_db)):
#     user = await db["users"].find_one({"username": username})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
    
#     update = {"$inc": {"score": score.points}}
#     if hasattr(score, "is_correct") and score.is_correct is not None:
#         if score.is_correct:
#             update["$inc"]["correct_answers"] = 1
#         else:
#             update["$inc"]["incorrect_answers"] = 1
    
#     await db["users"].update_one({"username": username}, update)
#     updated = await db["users"].find_one({"username": username})
#     return UserOut(**updated)

@router.get("/", response_model=List[LeaderboardEntry])
async def get_leaderboard(db: AsyncIOMotorDatabase = Depends(get_db)):
    cursor = db["users"].find().sort("score", -1).limit(10)
    users = await cursor.to_list(length=10)
    
    leaderboard = []
    for i, user in enumerate(users):
        leaderboard.append(
            LeaderboardEntry(
                username=user["username"],
                score=user["score"],
                rank=i + 1
            )
        )
    
    return leaderboard

# Helper used by other routers
async def update_user_score(db: AsyncIOMotorDatabase, username: str, is_correct: bool):
    user = await db["users"].find_one({"username": username})
    if not user:
        return
    
    update = {"$inc": {"score": 10, "correct_answers": 1}} if is_correct else {"$inc": {"incorrect_answers": 1}}
    await db["users"].update_one({"username": username}, update)