from datetime import datetime
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str

class UserOut(BaseModel):
    id: str
    username: str
    score: int
    correct_answers: int
    incorrect_answers: int
    created_at: datetime