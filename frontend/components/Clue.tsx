import { useEffect } from 'react';

interface ClueProps {
  clues: string[];
}

export default function Clue({ clues }: ClueProps) {
  // Add a subtle animation effect when clues change
  useEffect(() => {
    const clueElements = document.querySelectorAll('.clue-item');
    clueElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('opacity-100');
        element.classList.remove('opacity-0', 'translate-y-4');
      }, index * 300);
    });
  }, [clues]);

  return (
    <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-inner">
      <h2 className="text-lg font-medium text-blue-800 mb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Clues:
      </h2>
      <ul className="space-y-3">
        {clues.map((clue, index) => (
          <li 
            key={index} 
            className="clue-item opacity-0 translate-y-4 transition duration-500 text-lg text-blue-700 transform"
          >
            <div className="flex">
              <span className="inline-flex items-center justify-center bg-blue-200 text-blue-800 rounded-full w-7 h-7 text-center mr-3 font-medium shrink-0">
                {index + 1}
              </span>
              <span className="pt-0.5">{clue}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}