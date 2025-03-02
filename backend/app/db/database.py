import motor.motor_asyncio
from app.core.config import settings  # Import the settings
from typing import AsyncGenerator

# Create Motor client (asynchronous)
client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_DB_URI)
# db = client[settings.MONGO_DB_URI.split('/')[-1]]  # Extract the database name from the URI
db = client["destinations"]

# Asynchronous database session (similar to get_db in SQLAlchemy)
async def get_db() -> AsyncGenerator:
    try:
        yield db
    finally:
        pass  # No explicit close needed with Motor in most cases

# Asynchronous function to create indexes (run this on startup)
async def create_indexes():
    try:
        # Index on Destination.alias (unique)
        await db["travel_destinations"].create_index([("alias", 1)], unique=True, name="alias_unique", background=True)
        # Index on User.username (unique)
        await db["users"].create_index([("username", 1)], unique=True, name="username_unique", background=True)
        # Index on Challenge.challenge_code (unique)
        await db["challenges"].create_index([("challenge_code", 1)], unique=True, name="challenge_code_unique", background=True)
        print("Indexes created or verified successfully.")
    except Exception as e:
        print(f"Error creating indexes: {e}")