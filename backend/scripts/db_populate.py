import json
import pymongo
from pymongo import MongoClient
from typing import List, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection details (replace with your actual connection string)
MONGO_URI = os.getenv("MONGO_DB_URI")

# Database and collection names
DB_NAME = "destinations"  # Or your desired database name
COLLECTION_NAME = "travel_destinations"  # Or your desired collection name

# --- Data Model (from dataset_generator.py) ---
class Destination:
    def __init__(self, name: str, alias: str, clues: List[str], fun_facts: List[str]):
        self.name = name
        self.alias = alias
        self.clues = clues
        self.fun_facts = fun_facts

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "alias": self.alias,
            "clues": self.clues,
            "fun_facts": self.fun_facts
        }
# --- End Data Model ---

def populate_mongodb(json_file: str, mongo_uri: str, db_name: str, collection_name: str):
    """
    Populates a MongoDB database with data from a JSON file.

    Args:
        json_file: Path to the JSON file containing the destination data.
        mongo_uri: The MongoDB connection string.
        db_name: The name of the database to use.
        collection_name: The name of the collection to populate.
    """

    try:
        # Connect to MongoDB
        client = MongoClient(mongo_uri)
        db = client[db_name]
        collection = db[collection_name]

        # Check if collection exists and is not empty
        if collection.count_documents({}) > 0:
            print(f"Collection '{collection_name}' already exists and is not empty. Skipping population.")
            client.close()
            return

        # Load data from JSON file
        with open(json_file, 'r') as f:
            data = json.load(f)

        # Validate data format (important for type safety and preventing errors)
        validated_data = []
        for item in data:
            if isinstance(item, dict) and "name" in item and "alias" in item and "clues" in item and "fun_facts" in item:
                # Basic type checking
                if isinstance(item["name"], str) and isinstance(item["alias"], str) and \
                   isinstance(item["clues"], list) and isinstance(item["fun_facts"], list):
                    validated_data.append(item)
                else:
                    print(f"Warning: Skipping item due to incorrect data types: {item}")
            else:
                print(f"Warning: Skipping item due to missing fields: {item}")

        if not validated_data:
            print("No valid data found in the JSON file.")
            client.close()
            return

        # Insert data into MongoDB
        result = collection.insert_many(validated_data)
        print(f"Inserted {len(result.inserted_ids)} documents into '{collection_name}'.")

        # Create indexes (important for performance)
        collection.create_index("name")  # Index on the 'name' field
        collection.create_index("alias") # Index on the 'alias' field
        print("Created indexes on 'name' and 'alias' fields.")


    except pymongo.errors.ConnectionFailure as e:
        print(f"Could not connect to MongoDB: {e}")
    except FileNotFoundError:
        print(f"Error: JSON file not found: {json_file}")
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in file: {json_file}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        if 'client' in locals():  # Check if client was created before closing
            client.close()


if __name__ == "__main__":
    # Replace 'destinations.json' with the actual path to your JSON file
    json_filepath = 'destinations.json'
    populate_mongodb(json_filepath, MONGO_URI, DB_NAME, COLLECTION_NAME)