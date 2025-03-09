import random
from fastapi import APIRouter, Depends, HTTPException, Header
from typing import List, Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.database import get_db
from app.schemas.destination import (
    DestinationCreate, 
    DestinationOut, 
    DestinationClue, 
    AnswerVerification, 
    AnswerResponse
)
from app.api.users import update_user_score
from bson import ObjectId


router = APIRouter()

@router.get("/random", response_model=DestinationClue)
async def get_random_destination(
    x_username: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    total = await db["travel_destinations"].count_documents({})
    if total == 0:
        raise HTTPException(status_code=404, detail="No destinations found")
    
    random_index = random.randint(0, total - 1)
    cursor = db["travel_destinations"].find().skip(random_index).limit(1)
    destination_list = await cursor.to_list(length=1)
    if not destination_list:
        raise HTTPException(status_code=404, detail="Destination not found")
    destination = destination_list[0]
    
    # Get three other destinations for multiple choice options
    cursor = db["travel_destinations"].find({"_id": {"$ne": destination["_id"]}}, {"name": 1}).limit(3)
    others = await cursor.to_list(length=3)
    options = [d["name"] for d in others]
    options.append(destination["name"])
    random.shuffle(options)
    
    # Select 1-2 random clues as per game rules
    num_clues = min(2, len(destination.get("clues", [])))
    selected_clues = random.sample(destination.get("clues", []), num_clues) if destination.get("clues", []) else []
    
    return DestinationClue(
        destination_id=str(destination["_id"]),
        alias=destination["alias"],
        clues=selected_clues,
        options=options
    )

@router.post("/answer", response_model=AnswerResponse)
async def submit_answer(
    verification: AnswerVerification,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        destination_id = ObjectId(verification.destination_id)  # Convert to ObjectId
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid destination ID")
    destination = await db["travel_destinations"].find_one({"_id": destination_id})
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    is_correct = destination["name"].lower() == verification.user_answer.lower()
    fun_fact = random.choice(destination.get("fun_facts", []))
    points_earned = 10 if is_correct else 0
    
    # Update user score if username is provided
    if verification.username:
        await update_user_score(db, verification.username, is_correct)
    
    return AnswerResponse(
        correct=is_correct,
        correct_answer=destination["name"],
        fun_fact=fun_fact,
        points_earned=points_earned
    )

@router.post("/", response_model=DestinationOut)
async def create_destination(
    destination: DestinationCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    destination_doc = destination.model_dump()
    destination_doc["created_at"] = datetime.now()
    result = await db["travel_destinations"].insert_one(destination_doc)
    created = await db["travel_destinations"].find_one({"_id": result.inserted_id})
    return DestinationOut(**created)

@router.post("/bulk", response_model=List[DestinationOut])
async def create_destinations_bulk(
    destinations: List[DestinationCreate],
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    docs = []
    for d in destinations:
        doc = d.model_dump()
        doc["created_at"] = datetime.utcnow()
        docs.append(doc)
    result = await db["travel_destinations"].insert_many(docs)
    inserted_ids = result.inserted_ids
    docs = await db["travel_destinations"].find({"_id": {"$in": inserted_ids}}).to_list(length=len(inserted_ids))
    return [DestinationOut(**doc) for doc in docs]