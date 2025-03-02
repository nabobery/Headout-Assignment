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
- SQLAlchemy ORM
- SQLite (development) / PostgreSQL (production)

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

4. Set up environment variables (optional)

```bash
# Create a .env file with the following variables
DATABASE_URL=sqlite:///./globetrotter.db  # Or your PostgreSQL URL
SECRET_KEY=your_secret_key
```

## Running the Application

1. Start the FastAPI server

```bash
uvicorn app.main:app --reload
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


globetrotter/
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI entry point
│   │   ├── api/                 # API routes
│   │   │   ├── __init__.py
│   │   │   ├── destinations.py  # Destination endpoints
│   │   │   ├── users.py         # User management endpoints
│   │   │   └── challenges.py    # Friend challenge endpoints
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py        # Configuration settings
│   │   │   └── security.py      # Auth helpers if needed
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   ├── database.py      # Database connection
│   │   │   └── models.py        # Database models
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── destination.py   # Destination schemas
│   │   │   └── user.py          # User schemas
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── data_generator.py # AI data generation script
│   ├── tests/                    # Backend tests
│   │   ├── __init__.py
│   │   ├── test_destinations.py
│   │   └── test_users.py
│   ├── requirements.txt
│   └── README.md
│
├── frontend/                     # Next.js frontend
│   ├── public/
│   │   └── assets/              # Static assets
│   ├── src/
│   │   ├── app/                 # Next.js app router
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── game/            # Game pages
│   │   │   └── challenge/       # Challenge pages
│   │   ├── components/          # React components
│   │   │   ├── GameBoard.tsx    # Main game component
│   │   │   ├── Clue.tsx         # Clue display component
│   │   │   ├── AnswerOptions.tsx # Multiple choice options
│   │   │   ├── ResultFeedback.tsx # Feedback animations
│   │   │   ├── ScoreDisplay.tsx # User score component
│   │   │   └── ChallengeModal.tsx # Friend challenge popup
│   │   ├── lib/                 # Utility functions
│   │   │   ├── api.ts           # API client
│   │   │   └── types.ts         # TypeScript types
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useGame.ts       # Game state hook
│   │   │   └── useUser.ts       # User state hook
│   │   └── styles/              # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── scripts/
│   └── data_generator.py        # Standalone script for dataset generation
│
├── .gitignore
├── docker-compose.yml           # Container orchestration
└── README.md                    # Project documentation