'use client';

import { useEffect, useState, useMemo, JSX } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '~/components/LoadingSpinner';
import SetSelector from '../writing/components/SetSelector';
import ProgressBar from '../writing/components/ProgressBar';
import ResultModal from '../writing/components/ResultModal';
import { apiHelper } from '~/libs';
import { generatePassage, VocabularyTerm, PassageResult } from '~/libs/openrouter';
import { useAuthStore } from '~/hooks/authStore';

interface FillInTheBlanksQuestion {
  id: string;
  passage: string;
  missingWords: { index: number; term: string; correctAnswer: string }[];
  lang: string;
  userAnswers: string[];
}

interface Set {
  _id: string;
  title: string;
  terms: VocabularyTerm[];
}

export default function FillInTheBlanksPage() {
  const [questions, setQuestions] = useState<FillInTheBlanksQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isInReviewMode, setIsInReviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sets, setSets] = useState<Set[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string>('');
  const [wordLimit, setWordLimit] = useState<number>(20);
  const [currentVocabulary, setCurrentVocabulary] = useState<VocabularyTerm[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchSets();
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (questions.length > 0 && !quizCompleted) {
      setQuizStartTime(Date.now());
    }
  }, [questions.length]);

  const fetchSets = async () => {
    try {
      setLoading(true);
      const setsResponse = await apiHelper.get<Set[]>('/api/sets');
      if (!setsResponse.success || !setsResponse.data || setsResponse.data.length === 0) {
        setSets([]);
        setSelectedSetId('');
        setCurrentVocabulary([]);
        setQuestions([]);
        return;
      }
      const firstSetId = setsResponse.data[0]._id;
      setSets(setsResponse.data);
      setSelectedSetId(firstSetId);
      await fetchVocabulary(firstSetId, wordLimit);
    } catch (error) {
      console.error('Failed to fetch sets:', error);
      setSets([]);
      setSelectedSetId('');
      setCurrentVocabulary([]);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVocabulary = async (setId: string, limit: number) => {
    try {
      setLoading(true);
      const response = await apiHelper.get<VocabularyTerm[]>(`/api/sets/${setId}/random-terms?limit=${limit}`);
      if (response.success && response.data) {
        if (response.data.length < 1) {
          setError('Bộ từ vựng này không có từ nào để tạo bài tập.');
          setCurrentVocabulary([]);
          setQuestions([]);
        } else {
          const vocabularyWithLang = response.data.map(term => ({
            ...term,
            lang: term.lang || 'en-US',
          }));
          setCurrentVocabulary(vocabularyWithLang);
          await generatePassageWrapper(vocabularyWithLang);
        }
      } else {
        setCurrentVocabulary([]);
        setQuestions([]);
        setError('Không thể tải từ vựng. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Failed to fetch vocabulary:', error);
      setCurrentVocabulary([]);
      setQuestions([]);
      setError('Không thể tải từ vựng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const generatePassageWrapper = async (vocabulary: VocabularyTerm[]) => {
    try {
      setLoading(true);
      const result: PassageResult = await generatePassage(vocabulary);
      const newQuestion: FillInTheBlanksQuestion = {
        id: 'fib-1',
        passage: result.passage,
        missingWords: result.missingWords.map((mw, idx) => ({
          index: mw.index,
          term: mw.term,
          correctAnswer: mw.term,
        })),
        lang: vocabulary[0]?.lang || 'en-US',
        userAnswers: new Array(result.missingWords.length).fill(''),
      };
      setQuestions([newQuestion]);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Không thể tạo đoạn văn. Vui lòng thử lại.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, blankIndex: number, answer: string) => {
    if (isInReviewMode || quizCompleted) return;
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, userAnswers: q.userAnswers.map((ans, idx) => (idx === blankIndex ? answer : ans)) }
          : q
      )
    );
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    let totalItems = 0;
    questions.forEach(q => {
      q.missingWords.forEach((mw, idx) => {
        totalItems++;
        if (q.userAnswers[idx]?.toLowerCase() === mw.correctAnswer.toLowerCase()) {
          correctCount++;
        }
      });
    });
    setScore(correctCount);
    setQuizCompleted(true);

    let durationSeconds = 0;
    if (quizStartTime) {
      durationSeconds = Math.floor((Date.now() - quizStartTime) / 1000);
    }
    if (selectedSetId) {
      await apiHelper.post('/api/logs', {
        setId: selectedSetId,
        activityType: 'FILL',
        durationSeconds,
        correctAnswers: correctCount,
        totalItems
      });
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setQuizCompleted(false);
    setIsInReviewMode(false);
    setQuizStartTime(null);
    if (currentVocabulary.length > 0) {
      generatePassageWrapper(currentVocabulary);
    }
  };

  const handleApplyChanges = () => {
    if (selectedSetId) {
      setQuizCompleted(false);
      setIsInReviewMode(false);
      setScore(0);
      setQuestions([]);
      setError(null);
      fetchVocabulary(selectedSetId, wordLimit);
    }
  };

  const answeredCount = useMemo(
    () => questions.reduce((count, q) => count + q.userAnswers.filter(ans => ans !== '').length, 0),
    [questions]
  );
  const totalBlanks = useMemo(
    () => questions.reduce((count, q) => count + q.missingWords.length, 0),
    [questions]
  );
  const progressPercentage = useMemo(
    () => (totalBlanks > 0 ? (answeredCount / totalBlanks) * 100 : 0),
    [answeredCount, totalBlanks]
  );
  const allAnswered = totalBlanks > 0 && answeredCount === totalBlanks;
  const interactionsDisabled = isInReviewMode || quizCompleted;

  const renderPassage = (question: FillInTheBlanksQuestion) => {
    const segments = question.passage.split('[BLANK]');
    let parts: (string | JSX.Element)[] = [];
  
    segments.forEach((segment, i) => {
      parts.push(segment);
  
      if (i < question.missingWords.length) {
        parts.push(
          <span
            key={`blank-${question.id}-${i}`}
            className="inline-flex items-center mx-2 my-1 align-middle"
          >
            {/* Số thứ tự */}
            <span className="text-xs text-gray-400 mr-1">{i + 1}.</span>
  
            {/* Input */}
            <input
              type="text"
              value={question.userAnswers[i] || ''}
              onChange={(e) => handleAnswer(question.id, i, e.target.value)}
              disabled={interactionsDisabled}
              className={`inline-block w-28 px-2 py-1 text-sm border rounded-lg align-middle focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isInReviewMode
                  ? question.userAnswers[i]?.toLowerCase() ===
                    question.missingWords[i].correctAnswer.toLowerCase()
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200'
              } disabled:opacity-50 transition-colors duration-200`}
              placeholder="..."
            />
          </span>
        );
      }
    });
  
    return (
      <div className="mb-4 leading-relaxed">
        {parts}
  
        {isInReviewMode && (
          <div className="mt-2 ml-1 text-sm">
            {question.missingWords.map((mw, idx) => (
              <div key={idx}>
                {question.userAnswers[idx] ? (
                  question.userAnswers[idx].toLowerCase() ===
                  mw.correctAnswer.toLowerCase() ? (
                    <span className="text-green-600 dark:text-green-400">
                      Từ {idx + 1}: Đúng
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">
                      Từ {idx + 1}: Sai, đáp án đúng: {mw.correctAnswer}
                    </span>
                  )
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    Từ {idx + 1}: Chưa điền
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner isLoading={true} />
        </div>
      )}

      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link
              href="/practice"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold">Điền Vào Chỗ Trống</h1>
          </div>
          <div className="flex items-center space-x-3">
            <SetSelector
              sets={sets}
              selectedSetId={selectedSetId}
              wordLimit={wordLimit}
              loading={loading}
              onSetChange={setSelectedSetId}
              onWordLimitChange={setWordLimit}
              onApplyChanges={handleApplyChanges}
            />
            <div className="text-sm font-medium">
              Điểm: <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span> / {totalBlanks}
            </div>
          </div>
        </div>
      </header>

      <ResultModal
        isOpen={quizCompleted}
        score={score}
        totalQuestions={totalBlanks}
        onPlayAgain={resetQuiz}
        onReview={() => {
          setIsInReviewMode(true);
          setQuizCompleted(false);
        }}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-center">Điền từ vựng vào chỗ trống</h2>

          {error && (
            <div className="text-center py-4 text-red-600 dark:text-red-400">{error}</div>
          )}

          {questions.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Bài tập điền chỗ trống</h3>
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={q.id}>{renderPassage(q)}</div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {sets.length === 0 ? "Bạn chưa có bộ từ vựng nào." : "Bộ từ vựng này không đủ từ để tạo bài tập."}
            </div>
          )}

          <div className="mt-6 text-center">
            {!isInReviewMode && questions.length > 0 && (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className={`px-6 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                  allAnswered
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                    : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-600 dark:text-gray-400'
                }`}
              >
                Nộp bài
              </button>
            )}
            {isInReviewMode && (
              <button
                onClick={resetQuiz}
                className="px-6 py-2 rounded-lg text-base font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Làm lại bài tập
              </button>
            )}
          </div>

          <ProgressBar answeredCount={answeredCount} totalQuestions={totalBlanks} progressPercentage={progressPercentage} />
        </div>
      </main>
    </div>
  );
}
