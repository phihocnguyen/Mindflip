'use client';

interface ResultModalProps {
  isOpen: boolean;
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
  onReview: () => void;
}

export default function ResultModal({ isOpen, score, totalQuestions, onPlayAgain, onReview }: ResultModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Chúc mừng! 🎉</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Bạn đã hoàn thành bài tập với điểm số: {score}/{totalQuestions}
        </p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onPlayAgain}
            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-lg transition-colors font-semibold"
          >
            Chơi lại
          </button>
          <button
            onClick={onReview}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
          >
            Xem lại bài làm
          </button>
        </div>
      </div>
    </div>
  );
}