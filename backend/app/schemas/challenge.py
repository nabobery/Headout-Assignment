from datetime import datetime
from pydantic import BaseModel

class ChallengeCreate(BaseModel):
    challenger_username: str

class Challenge(BaseModel):
    id: str
    challenge_code: str
    challenger_username: str
    challenger_score: int
    created_at: datetime