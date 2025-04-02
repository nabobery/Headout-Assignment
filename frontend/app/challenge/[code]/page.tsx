"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GameBoard from "../../../components/GameBoard";
import useUser from "../../../hooks/useUser";
import Image from "next/image";
import { use } from "react";

export default function ChallengePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isLoading, error, fetchUser } = useUser();
  const [challengeData, setChallengeData] = useState<{
    id: string;
    fromUsername: string;
    score: number;
  } | null>(null);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(true);
  const [challengeError, setChallengeError] = useState<string | null>(null);

  useEffect(() => {
    const challengeId = resolvedParams.code;

    if (!challengeId) {
      setChallengeError("No challenge ID provided");
      setIsLoadingChallenge(false);
      return;
    }

    // Fetch challenge data
    const fetchChallenge = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/challenges/${challengeId}`
        );

        if (!response.ok) {
          throw new Error("Failed to load challenge");
        }

        const data = await response.json();
        setChallengeData(data);

        // If user is not logged in, store the challenge target username
        if (!user) {
          localStorage.setItem("globetrotter_username", data.toUsername);
          fetchUser(data.toUsername);
        }
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setChallengeError(
          "Could not load challenge. It may have expired or been removed."
        );
      } finally {
        setIsLoadingChallenge(false);
      }
    };

    fetchChallenge();
  }, [resolvedParams.code, user, fetchUser]);

  if (isLoading || isLoadingChallenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-500 to-purple-700">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (error || challengeError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-500 to-purple-700">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Challenge Error
          </h1>
          <p className="text-gray-600 mb-6">{error || challengeError}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!user || !challengeData) {
    return null; // Will handle in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 to-purple-700 py-8 px-4">
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
            <h1 className="text-2xl font-bold text-white">
              Globetrotter Challenge
            </h1>
          </div>

          <div className="flex items-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white mr-4">
              <span className="font-medium">{user.username}</span>
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

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-2">
            Challenge from {challengeData.fromUsername}
          </h2>
          <p className="mb-4">
            {challengeData.fromUsername} scored {challengeData.score} points and
            challenged you to beat their score!
          </p>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>Beat their score to win the challenge!</span>
          </div>
        </div>

        <GameBoard username={user.username} challengeMode={true} />
      </div>
    </div>
  );
}
