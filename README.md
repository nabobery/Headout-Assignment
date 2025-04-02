# Globetrotter Challenge

Globetrotter is the Ultimate Travel Guessing Game! In this full-stack web application, users receive cryptic clues about famous destinations and must guess which place is being hinted. Once they answer, they unlock fun facts, trivia, and other surprises!

## Core Features

- **Random Clues & Quiz:**
  - Presents 1–2 cryptic clues per destination.
  - Provides multiple possible answers.
  - Delivers immediate, animated feedback:
    - 🎉 Correct Answer: Confetti animation + fun fact.
    - 😢 Incorrect Answer: Sad-face animation + fun fact.
  - A "Play Again" button loads another random destination.
- **Score Tracking:**
  - Displays the user's current score.
  - Tracks the number of correct and incorrect answers.
- **Challenge a Friend:**
  - Users can register with a unique username.
  - A share popup generates a dynamic invite link (and image) for WhatsApp.
  - Invited friends see the inviter's score before playing.
  - Anyone with the invitation link can play all features.

## Dataset & AI Integration

- Start with a provided dataset and then use AI tools (like ChatGPT, OpenAI API, or web scraping) to expand it to 100+ destinations.
- Each destination contains clues, fun facts, and trivia.
- The dataset is stored and retrieved from the backend to prevent users from accessing all the answers.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** FastAPI, Motor (MongoDB)
- **Deployment:** Google Cloud Run

## Local Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/nabobery/Headout-Assignment
   cd Headout-Assignment
   ```

2. **Install Dependencies:**

   - Frontend:

     ```bash
     cd frontend
     npm install
     ```

   - Backend:

     ```bash
     cd ../backend
     pip install -r requirements.txt
     ```

3. **Environment Variables:**

   Create a `.env` file in both frontend and backend folders with appropriate variables. For example:

   - Frontend (.env.local):

     ```
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```

   - Backend (.env):

     ```
     MONGODB_URI=<your_mongodb_connection_string>
     ```

4. **Run Locally:**

   - Start backend server:

    ```bash
    python main.py
    ```

   - Start the frontend:

     ```bash
     npm run dev
     ```

## Deployment with Google Cloud Run

A GitHub workflow is provided to automate deployments to Cloud Run.

### Deployment Steps:

1. Make sure you have a Google Cloud project and have enabled Cloud Run and Cloud Build APIs.
2. Create a service account with permissions for Cloud Run and add its JSON key as a GitHub secret (`GCP_SA_KEY`).
3. Also, add your project ID as a GitHub secret (`GCP_PROJECT_ID`).
4. Push to the `main` branch to trigger the deployment workflow.

## Testing & Extensibility

- Additional unit tests are included (if any) for both backend and frontend.
- The modular structure allows easy extension, for example, incorporating new question types or integrating more AI-powered tools.

## Updated Icons

The application now uses custom icons defined in `frontend/app/layout.tsx`, ensuring brand consistency.

Feel free to contribute, test, and extend the app!

Happy Guessing!
