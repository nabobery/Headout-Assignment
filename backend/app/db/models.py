import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator
from pydantic.functional_validators import field_validator

class PyObjectId:  # Custom type for MongoDB ObjectIDs
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, str):
            raise TypeError('string required')
        try:
            from bson import ObjectId
            return ObjectId(v)
        except Exception:
            raise ValueError('invalid ObjectId')

class Destination(BaseModel):
    id: Optional[str] = Field(alias="_id", default_factory=lambda: str(uuid.uuid4()))  # Use string UUIDs, MongoDB's ObjectId is handled separately
    alias: str = Field(...)
    name: str = Field(...)
    clues: List[str] = Field(...)
    fun_facts: List[str] = Field(...)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            PyObjectId: str,  # Encode ObjectId as string
        }
        arbitrary_types_allowed = True
        collection = "travel_destinations"

    @field_validator('alias', 'name')
    def check_not_empty(cls, value):
        if not value.strip():
            raise ValueError('Field cannot be empty or contain only whitespace')
        return value

class User(BaseModel):
    id: Optional[str] = Field(alias="_id", default_factory=lambda: str(uuid.uuid4()))
    username: str = Field(...)
    score: int = Field(default=0)
    correct_answers: int = Field(default=0)
    incorrect_answers: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            PyObjectId: str,
        }
        arbitrary_types_allowed = True

    @field_validator('username')
    def check_username_not_empty(cls, value):
        if not value.strip():
            raise ValueError('Username cannot be empty or contain only whitespace')
        return value

class Challenge(BaseModel):
    id: Optional[str] = Field(alias="_id", default_factory=lambda: str(uuid.uuid4()))
    challenger_id: str = Field(...)
    challenge_code: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            PyObjectId: str,
        }
        arbitrary_types_allowed = True