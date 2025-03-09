from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional

class DestinationCreate(BaseModel):
    name: str
    alias: str
    clues: List[str]
    fun_facts: List[str]
    difficulty: str = "medium"

class DestinationOut(BaseModel):
    id: Optional[str] = Field(alias="_id")
    name: str
    alias: str
    clues: List[str]
    fun_facts: List[str]
    difficulty: str
    created_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class DestinationClue(BaseModel):
    destination_id: str
    clues: List[str]
    options: List[str]
    alias: str

class AnswerVerification(BaseModel):
    destination_id: str
    user_answer: str
    username: str

class AnswerResponse(BaseModel):
    correct: bool
    correct_answer: str
    fun_fact: str
    points_earned: Optional[int] = None