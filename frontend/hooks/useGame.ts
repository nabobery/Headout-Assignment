import { useState, useCallback } from "react";
import { GameDestination, GameResult, Score } from "../lib/types";
import { gameAPI } from "../lib/api";

export default function useGame(username: string, initialScore?: Score) {
  const [destination, setDestination] = useState<GameDestination | null>(null);
  const [options, setOptions] = useState<Array<string | { name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [score, setScore] = useState<Score>(
    initialScore || { total: 0, correct: 0, incorrect: 0 }
  );

  const fetchDestination = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await gameAPI.getRandomDestination(username);
      setDestination(data);
      setOptions(data.options);
    } catch (error) {
      console.error("Error fetching destination:", error);
      // For demo purposes, use mock data if API fails
      const mockDestination: GameDestination = {
        destination_id: "1",
        alias: "paris",
        clues: [
          "The city of lights awaits your discovery",
          "A tower of iron stands tall over the Seine",
          "Lovers lock their devotion on bridges here",
        ],
        options: ["Paris", "London", "Rome", "New York"],
      };

      setDestination(mockDestination);
      setOptions(mockDestination.options);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  const handleAnswer = useCallback(
    async (answerId: string) => {
      if (userAnswer || !destination) return;

      setUserAnswer(answerId);

      const selectedAnswer = options.find((option) =>
        typeof option === "string"
          ? option === answerId
          : option.name === answerId
      );

      if (!selectedAnswer) {
        console.error("Selected answer is undefined");
        return;
      }

      const answerText =
        typeof selectedAnswer === "string"
          ? selectedAnswer
          : selectedAnswer.name;

      try {
        const resultData = await gameAPI.submitAnswer(
          username,
          destination.destination_id,
          answerText
        );
        const { correct, correct_answer, fun_fact, points_earned } = resultData;

        // Update score
        setScore((prevScore) => ({
          total: prevScore.total + points_earned,
          correct: correct ? prevScore.correct + 1 : prevScore.correct,
          incorrect: !correct ? prevScore.incorrect + 1 : prevScore.incorrect,
        }));

        // Set result
        setResult({
          correct,
          correctAnswer: correct_answer,
          funFact: fun_fact,
          pointsEarned: points_earned,
        });

        // Save score to server if correct
        // if (correct) {
        //   await gameAPI.saveScore(
        //     username,
        //     points_earned,
        //     destination.destination_id
        //   );
        // }
      } catch (error) {
        console.error("Error processing answer:", error);
      }
    },
    [destination, options, userAnswer, username]
  );

  const resetGame = useCallback(() => {
    setUserAnswer(null);
    setResult(null);
  }, []);

  return {
    destination,
    options,
    isLoading,
    userAnswer,
    result,
    score,
    fetchDestination,
    handleAnswer,
    resetGame,
  };
}
