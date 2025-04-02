"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const storedUsername = localStorage.getItem("globetrotter_username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Trigger entrance animation
    setShowAnimation(true);
  }, []);

  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter a username to continue");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create user or get existing user
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 400) {
          // If user exists, that's fine, we'll just use the existing account
          // We can continue to the game
        } else {
          throw new Error(data.detail || "Failed to create user");
        }
      }

      // Store username in localStorage for future use
      localStorage.setItem("globetrotter_username", username);

      // Redirect to game page
      router.push("/game");
    } catch (err: unknown) {
      console.error("Error starting game:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700 p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-400/20 animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-blue-300/20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-2/3 left-1/2 w-48 h-48 rounded-full bg-blue-200/20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div
        className={`bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center relative z-10 transition-all duration-700 ${
          showAnimation
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="mb-8 relative w-32 h-32">
          <Image
            src="/assets/logo.svg"
            alt="Globetrotter Logo"
            fill
            priority
            className="object-contain"
          />
        </div>

        <h1 className="text-4xl font-bold text-blue-800 mb-2 text-center">
          Globetrotter
        </h1>
        <p className="text-slate-600 text-center mb-8">
          Test your geography knowledge with cryptic clues about famous
          destinations!
        </p>

        <form onSubmit={handleStartGame} className="w-full">
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter your username to begin
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
              placeholder="YourUsername"
              maxLength={20}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 animate-bounce">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="relative z-10">
              {isLoading ? "Loading..." : "Start Game"}
            </span>
            <span className="absolute inset-0 h-full w-0 bg-blue-800 transition-all duration-300 group-hover:w-full"></span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            How to Play
          </h2>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Read the cryptic clues about a destination</li>
            <li>• Choose the correct location from the options</li>
            <li>• Score points for correct answers</li>
            <li>• Challenge friends to beat your score</li>
          </ul>
        </div>
      </div>

      <footer className="mt-8 text-white/80 text-sm">
        &copy; {new Date().getFullYear()} Globetrotter - Test your geography
        knowledge
      </footer>
    </main>
  );
}
