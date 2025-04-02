import { useState, useEffect, useCallback } from "react";
import { User } from "../lib/types";

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (username: string) => {
    if (!username) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData: User = await response.json();
      setUser(userData);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Could not load user data. Please try again later.");

      // For demo purposes, use mock data if API fails
      setUser({
        username,
        score: 0,
        correct_answers: 0,
        incorrect_answers: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserScore = useCallback(
    (points: number) => {
      if (!user) return;

      setUser((prevUser) => ({
        ...prevUser!,
        totalScore: prevUser!.totalScore + points,
      }));

      // Update the user score on the server
      try {
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.username}/score`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ points }),
          }
        );
      } catch (error) {
        console.error("Error updating user score:", error);
      }
    },
    [user]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("globetrotter_username");
    setUser(null);
  }, []);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("globetrotter_username");
    if (storedUsername) {
      fetchUser(storedUsername);
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  return {
    user,
    isLoading,
    error,
    fetchUser,
    updateUserScore,
    logout,
  };
}
