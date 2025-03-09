from datetime import datetime
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from bson import ObjectId

class UserCreate(BaseModel):
    username: str

class UserScore(BaseModel):
    points: int
    is_correct: Optional[bool] = None

class UserOut(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    username: str
    score: int
    correct_answers: int
    incorrect_answers: int
    created_at: datetime

    
    @field_validator('id', mode='before')
    def convert_objectid_to_str(cls, value):
        if isinstance(value, ObjectId):
            return str(value)
        return value

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class LeaderboardEntry(BaseModel):
    username: str
    score: int
    rank: int