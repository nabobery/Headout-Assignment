"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ResultFeedbackProps {
  result: {
    correct: boolean;
    correct_answer: string;
    fun_fact: string;
  };
  onNextQuestion: () => void;
}

export default function ResultFeedback({
  result,
  onNextQuestion,
}: ResultFeedbackProps) {
  useEffect(() => {
    // Trigger confetti animation for correct answers
    if (result.correct) {
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ["#3B82F6", "#60A5FA", "#93C5FD"];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });

        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [result.correct]);

  return (
    <div className="mt-6 p-6 rounded-xl transition-all duration-500 animate-fadeIn shadow-lg">
      <div
        className={`p-6 rounded-xl mb-6 shadow-sm ${
          result.correct
            ? "bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300"
            : "bg-gradient-to-r from-red-100 to-rose-100 border border-red-300"
        }`}
      >
        <div className="flex items-center mb-4">
          {result.correct ? (
            <div className="flex items-center text-green-800">
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-3 animate-bounce shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Correct!</h3>
            </div>
          ) : (
            <div className="flex items-center text-red-800">
              <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mr-3 animate-pulse shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Not quite!</h3>
            </div>
          )}
        </div>

        {!result.correct && (
          <p className="mb-4 text-red-800 font-medium">
            The correct answer is{" "}
            <span className="font-bold bg-red-200 px-3 py-1 rounded shadow-sm">
              {result.correct_answer}
            </span>
          </p>
        )}

        <div className="mt-3 bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold mb-2 flex items-center text-blue-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Fun Fact:
          </h4>
          <p className="text-gray-800">{result.fun_fact}</p>
        </div>
      </div>

      <button
        onClick={onNextQuestion}
        className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition group relative overflow-hidden shadow-lg"
      >
        <span className="relative z-10 flex items-center justify-center text-lg">
          Next Destination
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </span>
        <span className="absolute inset-0 h-full w-0 bg-blue-700 transition-all duration-300 group-hover:w-full"></span>
      </button>
    </div>
  );
}