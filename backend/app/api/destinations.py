import random
from fastapi import APIRouter, Depends, HTTPException
from typing import List
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

router = APIRouter()

@router.get("/random", response_model=DestinationClue)
async def get_random_destination(db: AsyncIOMotorDatabase = Depends(get_db)):
    total = await db["destinations"].count_documents({})
    if total == 0:
        raise HTTPException(status_code=404, detail="No destinations found")
    
    random_index = random.randint(0, total - 1)
    cursor = db["destinations"].find().skip(random_index).limit(1)
    destination_list = await cursor.to_list(length=1)
    if not destination_list:
        raise HTTPException(status_code=404, detail="Destination not found")
    destination = destination_list[0]
    
    # Get three other destinations for multiple choice options
    cursor = db["destinations"].find({"_id": {"$ne": destination["_id"]}}, {"name": 1}).limit(3)
    others = await cursor.to_list(length=3)
    options = [d["name"] for d in others]
    options.append(destination["name"])
    random.shuffle(options)
    
    num_clues = min(2, len(destination.get("clues", [])))
    selected_clues = random.sample(destination.get("clues", []), num_clues) if destination.get("clues", []) else []
    
    return DestinationClue(
        destination_id=str(destination["_id"]),
        alias=destination["alias"],
        clues=selected_clues,
        options=options
    )

@router.post("/verify", response_model=AnswerResponse)
async def verify_answer(
    verification: AnswerVerification,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    destination = await db["destinations"].find_one({"alias": verification.destination_alias})
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    is_correct = destination["name"].lower() == verification.user_answer.lower()
    fun_fact = random.choice(destination.get("fun_facts", []))
    
    return AnswerResponse(
        correct=is_correct,
        correct_answer=destination["name"],
        fun_fact=fun_fact
    )

@router.post("/", response_model=DestinationOut)
async def create_destination(
    destination: DestinationCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    destination_doc = destination.dict()
    destination_doc["created_at"] = datetime.utcnow()
    result = await db["destinations"].insert_one(destination_doc)
    created = await db["destinations"].find_one({"_id": result.inserted_id})
    created["_id"] = str(created["_id"])
    return DestinationOut(**created)

@router.post("/bulk", response_model=List[DestinationOut])
async def create_destinations_bulk(
    destinations: List[DestinationCreate],
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    docs = []
    for d in destinations:
        doc = d.dict()
        doc["created_at"] = datetime.utcnow()
        docs.append(doc)
    result = await db["destinations"].insert_many(docs)
    inserted_ids = result.inserted_ids
    docs = await db["destinations"].find({"_id": {"$in": inserted_ids}}).to_list(length=len(inserted_ids))
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs