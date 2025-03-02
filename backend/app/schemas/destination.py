from datetime import datetime
from pydantic import BaseModel
from typing import List

class DestinationCreate(BaseModel):
    alias: str
    name: str
    clues: List[str]
    fun_facts: List[str]

class DestinationOut(BaseModel):
    id: str
    alias: str
    name: str
    clues: List[str]
    fun_facts: List[str]
    created_at: datetime

    class Config:
        orm_mode = True

class DestinationClue(BaseModel):
    destination_id: str
    alias: str
    clues: List[str]
    options: List[str]

class AnswerVerification(BaseModel):
    destination_alias: str
    user_answer: str
    username: str = ""  # Optional: only provided if score update is needed

class AnswerResponse(BaseModel):
    correct: bool
    correct_answer: str
    fun_fact: str