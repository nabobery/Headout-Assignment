interface AnswerOptionsProps {
  options: string[];
  disabled: boolean;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
}

export default function AnswerOptions({
  options,
  disabled,
  selectedAnswer,
  onSelect,
}: AnswerOptionsProps) {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Select your answer:
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option)}
            disabled={disabled}
            className={`
                p-4 rounded-lg text-left font-medium transition-all duration-300 relative
                ${
                  selectedAnswer === option
                    ? "ring-3 ring-blue-600 bg-blue-100 transform scale-[1.02] text-blue-800 shadow-md"
                    : "hover:bg-blue-50 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] text-gray-800"
                }
                ${
                  disabled
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer"
                }
                bg-white border border-gray-300 shadow-sm hover:border-blue-300
              `}
            aria-pressed={selectedAnswer === option}
          >
            <span className="flex items-center">
              <span className={`
                inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 shrink-0 font-bold shadow-sm
                ${selectedAnswer === option 
                  ? "bg-blue-600 text-white" 
                  : "bg-blue-200 text-blue-900"}
              `}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className={`${selectedAnswer === option ? "font-semibold" : ""}`}>{option}</span>
            </span>
            {selectedAnswer === option && (
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}