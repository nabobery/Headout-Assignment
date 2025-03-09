# Globetrotter Backend

This is the backend API for the Globetrotter travel quiz game.

## Features

- Random destination clues with multiple-choice answers
- User score tracking
- Friend challenge system
- Expandable destination database

## Technology Stack

- Python 3.8+
- FastAPI
- MongoDB (asynchronous with Motor)
- Pydantic for data validation
- Motor for asynchronous MongoDB operations

## Installation

1. Clone the repository

2. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. Set up environment variables

Create a `.env` file with the following variables:

```bash
MONGO_DB_URI=mongodb://username:password@localhost:27017/travel_destinations  # Replace with your MongoDB URI
SECRET_KEY=your_secret_key
```

## Running the Application

1. Start the FastAPI server using `main.py`:

```bash
python app/main.py
```

2. Access the API documentation

```
http://localhost:8000/docs
```

## Loading Destination Data

Generate destination data using the data generator script:

```bash
python scripts/data_generator.py
```

Then load it into the database:

```bash
python scripts/load_destinations.py destinations.json
```

## API Endpoints

### Destinations

- `GET /api/destinations/random` - Get a random destination with clues
- `POST /api/destinations/verify` - Verify user answer

### Users

- `POST /api/users` - Create new user
- `GET /api/users/{username}` - Get user profile and score

### Challenges

- `POST /api/challenges` - Create a challenge link
- `GET /api/challenges/{challenge_code}` - Get challenge details

## Development

- Run tests: `pytest` (requires pytest to be installed)
- Format code: `black app/` (requires black to be installed)
