/**
 * User-related types
 */
export interface User {
  _id?: string;
  username: string;
  score: number;
  correct_answers: number;
  incorrect_answers: number;
  created_at?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface LeaderboardEntry {
  username: string;
  totalScore: number;
  rank: number;
}

/**
 * Game-related types
 */
export interface Destination {
  id: string;
  name: string;
  clues: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  imageUrl?: string;
  funFact?: string;
}

export interface Option {
  id: string;
  name: string;
}

export interface Score {
  total: number;
  correct: number;
  incorrect: number;
}

export interface GameResult {
  correct: boolean;
  correctAnswer: string; // Ensure this matches the naming convention
  pointsEarned?: number; // Ensure this matches the naming convention
  funFact?: string; // Ensure this matches the naming convention
}

/**
 * Challenge-related types
 */
export interface Challenge {
  id: string;
  fromUsername: string;
  toUsername: string;
  score: number;
  status: "pending" | "accepted" | "completed" | "expired";
  createdAt: string;
  expiresAt: string;
}

export interface ChallengeResult {
  challengeId: string;
  fromUsername: string;
  fromScore: number;
  toUsername: string;
  toScore: number;
  winner: string;
  createdAt: string;
  completedAt: string;
}

/**
 * API Response types
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  detail: string;
  status: number;
}

export interface AnswerResponse {
  correct: boolean;
  correct_answer: string;
  fun_fact: string;
  points_earned: number;
}

export interface GameDestination {
  destination_id: string;
  alias: string;
  clues: string[];
  options: string[];
}
