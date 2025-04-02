interface ScoreDisplayProps {
  score: {
    total: number;
    correct: number;
    incorrect: number;
  };
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  const accuracy = score.correct + score.incorrect > 0
    ? Math.round((score.correct / (score.correct + score.incorrect)) * 100)
    : 0;

  // Determine badge based on accuracy
  const getBadge = () => {
    if (accuracy >= 90) return { title: "Expert Explorer", color: "blue", icon: "star" };
    if (accuracy >= 70) return { title: "Skilled Traveler", color: "indigo", icon: "map" };
    if (accuracy >= 50) return { title: "Curious Voyager", color: "purple", icon: "globe" };
    return { title: "Novice Adventurer", color: "teal", icon: "compass" };
  };

  const badge = getBadge();

  // Badge icon selection
  const BadgeIcon = () => {
    switch (badge.icon) {
      case "star":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case "map":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        );
      case "globe":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
        );
      case "compass":
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-opacity-5 pointer-events-none">
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>
        <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-green-100 rounded-full opacity-30"></div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-800 flex items-center">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            Your Score
          </h2>

          {/* Big Score Display */}
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {score.total}
            </div>
            <div className="text-xs text-gray-500">Points</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm transform transition-transform hover:scale-102 border border-green-200">
            <div className="bg-green-200 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Correct</p>
              <p className="text-2xl font-bold text-green-800">{score.correct}</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm transform transition-transform hover:scale-102 border border-red-200">
            <div className="bg-red-200 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Incorrect</p>
              <p className="text-2xl font-bold text-red-800">{score.incorrect}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-gray-600 text-sm">Accuracy</span>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-blue-700">{accuracy}%</span>
                <span className="ml-1 text-xs text-gray-500">({score.correct}/{score.correct + score.incorrect})</span>
              </div>
            </div>

            <div className="text-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${badge.color}-100 text-${badge.color}-800`}>
                <BadgeIcon />
                {badge.title}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mt-2">
            <div 
              className={`bg-${badge.color}-600 h-3 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${accuracy}%` }}
            >
              {accuracy > 0 && (
                <div className={`h-full w-full bg-gradient-to-r from-${badge.color}-700 via-${badge.color}-500 to-${badge.color}-600 ${accuracy > 50 ? 'animate-pulse' : ''}`}></div>
              )}
            </div>
          </div>
        </div>

        {/* Motivational message */}
        <div className="mt-6 text-center">
          {accuracy >= 90 ? (
            <p className="text-blue-800 text-sm bg-blue-50 py-2 px-4 rounded-lg">Amazing performance! You&apos;re a geography expert!</p>
          ) : accuracy >= 70 ? (
            <p className="text-indigo-800 text-sm bg-indigo-50 py-2 px-4 rounded-lg">Great job! Your global knowledge is impressive.</p>
          ) : accuracy >= 50 ? (
            <p className="text-purple-800 text-sm bg-purple-50 py-2 px-4 rounded-lg">Good effort! You&apos;re building your geography skills.</p>
          ) : (
            <p className="text-teal-800 text-sm bg-teal-50 py-2 px-4 rounded-lg">Keep exploring! Every journey begins with a single step.</p>
          )}
        </div>
      </div>
    </div>
  );
}