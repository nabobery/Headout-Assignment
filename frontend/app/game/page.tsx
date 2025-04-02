"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GameBoard from "../../components/GameBoard";
import useUser from "../../hooks/useUser";
import Image from "next/image";

export default function GamePage() {
  const router = useRouter();
  const { user, isLoading, error } = useUser();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // If user is not logged in, redirect to home page
    if (!isLoading && !user && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/");
    }
  }, [isLoading, user, router, isRedirecting]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const initialScore = {
    total: user.score || 0,
    correct: user.correct_answers || 0,
    incorrect: user.incorrect_answers || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="relative w-12 h-12 mr-3">
              <Image
                src="/assets/logo.svg"
                alt="Globetrotter Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-white">Globetrotter</h1>
          </div>

          <div className="flex items-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white mr-4">
              <span className="font-medium text-white/90">
                {user.username || "Guest"}
              </span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-white transition"
              aria-label="Home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </button>
          </div>
        </header>

        <GameBoard username={user.username} initialScore={initialScore} />
      </div>
    </div>
  );
}
