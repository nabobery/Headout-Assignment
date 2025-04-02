"use client";

import { useState, useEffect } from "react";
import Clue from "./Clue";
import AnswerOptions from "./AnswerOptions";
import ResultFeedback from "./ResultFeedback";
import ScoreDisplay from "./ScoreDisplay";
import ChallengeModal from "./ChallengeModal";
import useGame from "../hooks/useGame";
import { GameResult, Option, Score } from "../lib/types";

interface GameBoardProps {
  username: string;
  challengeMode?: boolean;
  initialScore?: Score;
}

export default function GameBoard({
  username,
  challengeMode = false,
  initialScore,
}: GameBoardProps) {
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  const {
    destination,
    options,
    isLoading,
    userAnswer,
    result,
    score,
    fetchDestination,
    handleAnswer,
    resetGame,
  } = useGame(username, initialScore);

  // Compute answerOptions safely based on options content
  let answerOptions: Option[] = [];
  if (
    options.length > 0 &&
    typeof options[0] === "object" &&
    options[0] !== null &&
    "name" in (options[0] as object)
  ) {
    answerOptions = options as Option[];
  } else {
    // Convert string[] to Option[] with generated IDs
    answerOptions = (options as string[]).map((opt, index) => ({
      id: index.toString(),
      name: opt,
    }));
  }

  useEffect(() => {
    fetchDestination();
  }, [fetchDestination]);

  const handleNextQuestion = () => {
    resetGame();
    fetchDestination();
  };

  if (isLoading && !destination) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your next destination...</p>
          <div className="mt-6 max-w-md mx-auto">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Check for no destination found
  if (!isLoading && !destination) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Oops! No Destination Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find any destinations to show. Please try again.
          </p>
          <button
            onClick={fetchDestination}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ScoreDisplay score={score} />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transform transition-all hover:shadow-xl">
        <div className="p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-6 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-3 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
              />
            </svg>
            Where in the world is this?
          </h1>

          {destination && (
            <>
              <Clue clues={destination.clues} />

              {!result && (
                <AnswerOptions
                  options={answerOptions.map((opt) => opt.name)}
                  disabled={!!userAnswer}
                  onSelect={handleAnswer}
                  selectedAnswer={userAnswer}
                />
              )}

              {result && (
                <ResultFeedback
                  result={(() => {
                    const res = result as GameResult;
                    return {
                      correct: res.correct,
                      correct_answer: res.correctAnswer,
                      fun_fact: res.funFact ?? "",
                      points_earned: res.pointsEarned ?? 0,
                    };
                  })()}
                  onNextQuestion={handleNextQuestion}
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        {!challengeMode && (
          <button
            onClick={() => setShowChallengeModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg group"
          >
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 group-hover:animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Challenge a Friend
            </span>
          </button>
        )}
      </div>

      {showChallengeModal && (
        <ChallengeModal
          username={username}
          score={score.total}
          onClose={() => setShowChallengeModal(false)}
        />
      )}
    </div>
  );
}
