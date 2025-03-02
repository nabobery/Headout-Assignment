from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.database import get_db
from app.schemas.user import UserCreate, UserOut

router = APIRouter()

@router.post("/", response_model=UserOut)
async def create_user(user: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    exists = await db["users"].find_one({"username": user.username})
    if exists:
        raise HTTPException(status_code=400, detail="Username already exists")
    user_doc = user.dict()
    user_doc["created_at"] = datetime.utcnow()
    user_doc["score"] = 0
    user_doc["correct_answers"] = 0
    user_doc["incorrect_answers"] = 0
    result = await db["users"].insert_one(user_doc)
    new_user = await db["users"].find_one({"_id": result.inserted_id})
    new_user["_id"] = str(new_user["_id"])
    return new_user

@router.put("/score/{username}", response_model=UserOut)
async def update_user_score_endpoint(username: str, is_correct: bool, db: AsyncIOMotorDatabase = Depends(get_db)):
    user = await db["users"].find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    update = {"$inc": {"score": 10, "correct_answers": 1}} if is_correct else {"$inc": {"incorrect_answers": 1}}
    await db["users"].update_one({"username": username}, update)
    updated = await db["users"].find_one({"username": username})
    updated["_id"] = str(updated["_id"])
    return updated

# Helper used by other routers
async def update_user_score(db: AsyncIOMotorDatabase, username: str, is_correct: bool):
    user = await db["users"].find_one({"username": username})
    if not user:
        return
    update = {"$inc": {"score": 10, "correct_answers": 1}} if is_correct else {"$inc": {"incorrect_answers": 1}}
    await db["users"].update_one({"username": username}, update)