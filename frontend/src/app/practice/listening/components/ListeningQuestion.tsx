'use client';

import { useState } from 'react';

interface ListeningQuestionProps {
  question: {
    id: string;
    term: string;
    correctAnswer: string;
    lang: string;
    userAnswer?: string;
  };
  index: number;
  isInReviewMode: boolean;
  interactionsDisabled: boolean;
  onAnswer: (questionId: string, answer: string) => void;
}

export default function ListeningQuestion({
  question,
  index,
  isInReviewMode,
  interactionsDisabled,
  onAnswer,
}: ListeningQuestionProps) {
  const [inputValue, setInputValue] = useState(question.userAnswer || '');

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(question.term);
    utterance.lang = question.lang || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onAnswer(question.id, value);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="w-8 text-gray-500 dark:text-gray-400">{index + 1}.</div>
      <button
        onClick={handlePlayAudio}
        disabled={interactionsDisabled}
        className={`p-2 rounded-full ${
          interactionsDisabled
            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } transition-colors duration-200`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.2A1 1 0 0010 9.8v4.4a1 1 0 001.555.832l3.197-2.2a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        disabled={interactionsDisabled}
        className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isInReviewMode
            ? question.userAnswer?.toLowerCase() === question.correctAnswer.toLowerCase()
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-gray-900 dark:text-gray-200'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200'
        } disabled:opacity-50 transition-colors duration-200`}
        placeholder="Nhập từ vựng bạn nghe được"
      />
      {isInReviewMode && (
        <div className="text-sm">
          {question.userAnswer?.toLowerCase() === question.correctAnswer.toLowerCase() ? (
            <span className="text-green-600 dark:text-green-400">Đúng</span>
          ) : (
            <span className="text-red-600 dark:text-red-400">Sai, đáp án đúng: {question.correctAnswer}</span>
          )}
        </div>
      )}
    </div>
  );
}