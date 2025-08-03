'use client';

interface ProgressBarProps {
  answeredCount: number;
  totalQuestions: number;
  progressPercentage: number;
}

export default function ProgressBar({ answeredCount, totalQuestions, progressPercentage }: ProgressBarProps) {
  return (
    <div className="mt-8 max-w-xl mx-auto">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
        Tiến độ: {answeredCount} / {totalQuestions} ({Math.round(progressPercentage)}%)
      </div>
    </div>
  );
}