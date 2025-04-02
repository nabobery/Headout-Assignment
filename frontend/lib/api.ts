import { GameDestination } from "./types"; // Import the GameDestination type

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * User-related API calls
 */
export const userAPI = {
  create: (username: string) =>
    fetchAPI("/api/users", {
      method: "POST",
      body: JSON.stringify({ username }),
    }),

  get: (username: string) => fetchAPI(`/api/users/${username}`),

  // updateScore: (username: string, points: number) =>
  //   fetchAPI(`/api/users/${username}/score`, {
  //     method: "POST",
  //     body: JSON.stringify({ points }),
  //   }),

  getLeaderboard: () => fetchAPI("/api/leaderboard"),
};

/**
 * Game-related API calls
 */
export const gameAPI = {
  getRandomDestination: async (username: string) =>
    fetchAPI<GameDestination>("/api/destinations/random", {
      headers: {
        "X-Username": username,
      },
    }),

  submitAnswer: async (
    username: string,
    destinationId: string,
    answer: string
  ) =>
    fetchAPI<{
      correct: boolean;
      correct_answer: string;
      fun_fact: string;
      points_earned: number;
    }>("/api/destinations/answer", {
      method: "POST",
      body: JSON.stringify({
        destination_id: destinationId,
        user_answer: answer,
        username,
      }),
    }),

  // saveScore: async (username: string, score: number, destinationId: string) =>
  //   fetchAPI(`/api/users/${username}/score`, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       score,
  //       destinationId,
  //     }),
  //   }),
};

/**
 * Challenge-related API calls
 */
export const challengeAPI = {
  create: (fromUsername: string, toUsername: string, score: number) =>
    fetchAPI("/api/challenges", {
      method: "POST",
      body: JSON.stringify({
        fromUsername,
        toUsername,
        score,
      }),
    }),

  get: (challengeId: string) => fetchAPI(`/api/challenges/${challengeId}`),

  getUserChallenges: (username: string) =>
    fetchAPI(`/api/users/${username}/challenges`),
};
