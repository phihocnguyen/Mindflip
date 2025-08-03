'use client';

interface WritingQuestion {
  id: string;
  definition: string;
  correctAnswer: string;
  userAnswer?: string;
}

interface WritingQuestionProps {
  question: WritingQuestion;
  index: number;
  isInReviewMode: boolean;
  interactionsDisabled: boolean;
  onAnswer: (questionId: string, answer: string) => void;
}

export default function WritingQuestion({
  question,
  index,
  isInReviewMode,
  interactionsDisabled,
  onAnswer,
}: WritingQuestionProps) {
  const isCorrect = isInReviewMode && question.userAnswer?.toLowerCase() === question.correctAnswer.toLowerCase();
  const isWrong = isInReviewMode && question.userAnswer && question.userAnswer.toLowerCase() !== question.correctAnswer.toLowerCase();

  return (
    <div>
      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
        {index + 1}. Định nghĩa: <span className="text-blue-600 dark:text-blue-400">{question.definition}</span>
        {isWrong && <span className="ml-2 text-sm font-normal text-red-500">(Sai)</span>}
        {isCorrect && <span className="ml-2 text-sm font-normal text-green-500">(Đúng)</span>}
      </p>
      <input
        type="text"
        value={question.userAnswer || ''}
        onChange={(e) => onAnswer(question.id, e.target.value)}
        disabled={interactionsDisabled}
        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${
          isInReviewMode ? (isCorrect ? 'border-green-500 bg-green-100 dark:bg-green-900/30' : isWrong ? 'border-red-500 bg-red-100 dark:bg-red-900/30' : '') : 'border-gray-300'
        } ${interactionsDisabled ? 'cursor-not-allowed' : ''}`}
        placeholder="Nhập từ vựng..."
      />
      {isInReviewMode && isWrong && (
        <div className="mt-2 text-sm text-green-600 dark:text-green-500">
          Đáp án đúng: <span className="font-bold">{question.correctAnswer}</span>
        </div>
      )}
    </div>
  );
}