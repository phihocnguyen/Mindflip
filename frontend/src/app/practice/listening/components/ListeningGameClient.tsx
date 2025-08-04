'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '~/components/LoadingSpinner';
import SetSelector from '../../writing/components/SetSelector';
import ListeningQuestion from './ListeningQuestion';
import ProgressBar from '../../writing/components/ProgressBar';
import ResultModal from '../../writing/components/ResultModal';
import { apiHelper } from '~/libs';
import { useAuthStore } from '~/hooks/authStore';

// --- INTERFACES ---
interface VocabularyTerm {
  term: string;
  definition: string;
  lang: string; // e.g., 'en-US', 'es-ES', 'fr-FR'
}

interface ListeningQuestion {
  id: string;
  term: string;
  correctAnswer: string;
  lang: string;
  userAnswer?: string;
}

interface Set {
  _id: string;
  title: string;
  terms: VocabularyTerm[];
}

export default function ListeningGameClient() {
  // --- STATE MANAGEMENT ---
  const [questions, setQuestions] = useState<ListeningQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isInReviewMode, setIsInReviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sets, setSets] = useState<Set[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string>('');
  const [wordLimit, setWordLimit] = useState<number>(20);
  const [currentVocabulary, setCurrentVocabulary] = useState<VocabularyTerm[]>([]);
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  // --- AUTHENTICATION AND SETS FETCHING ---
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchSets();
  }, [isAuthenticated, isLoading, router]);

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
      fetchVocabulary(firstSetId, wordLimit);
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

  // --- INITIALIZE QUESTIONS ---
  useEffect(() => {
    if (currentVocabulary.length > 0) {
      initializeQuestions();
    } else {
      setQuestions([]);
    }
  }, [currentVocabulary]);

  const initializeQuestions = () => {
    if (currentVocabulary.length < 1) return;
    const shuffledVocab = [...currentVocabulary].sort(() => Math.random() - 0.5);
    const newQuestions: ListeningQuestion[] = shuffledVocab.map((termData, index) => ({
      id: `lq-${index}`,
      term: termData.term,
      correctAnswer: termData.term,
      lang: termData.lang || 'en-US', // Fallback to en-US if lang is missing
    }));
    setQuestions(newQuestions);
  };

  // --- FETCH VOCABULARY ---
  const fetchVocabulary = async (setId: string, limit: number) => {
    try {
      setLoading(true);
      const response = await apiHelper.get<VocabularyTerm[]>(`/api/sets/${setId}/random-terms?limit=${limit}`);
      if (response.success && response.data) {
        if (response.data.length < 1) {
          alert('Bộ từ vựng này không có từ nào để tạo bài tập.');
          setCurrentVocabulary([]);
          setQuestions([]);
        } else {
          // Ensure lang is set; fallback to 'en-US' if missing
          const vocabularyWithLang = response.data.map(term => ({
            ...term,
            lang: term.lang || 'en-US',
          }));
          setCurrentVocabulary(vocabularyWithLang);
        }
      } else {
        setCurrentVocabulary([]);
        setQuestions([]);
      }
    } catch (error) {
      console.error('Failed to fetch vocabulary:', error);
      setCurrentVocabulary([]);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE USER INTERACTIONS ---
  const handleAnswer = (questionId: string, answer: string) => {
    if (isInReviewMode || quizCompleted) return;
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, userAnswer: answer.trim() } : q));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (q.userAnswer?.toLowerCase() === q.correctAnswer.toLowerCase()) correctCount++;
    });
    setScore(correctCount);
    setQuizCompleted(true);
  };

  const resetQuiz = () => {
    setScore(0);
    setQuizCompleted(false);
    setIsInReviewMode(false);
    if (currentVocabulary.length > 0) {
      initializeQuestions();
    }
  };

  const handleApplyChanges = () => {
    if (selectedSetId) {
      setQuizCompleted(false);
      setIsInReviewMode(false);
      setScore(0);
      setQuestions([]);
      fetchVocabulary(selectedSetId, wordLimit);
    }
  };

  // --- MEMOIZED VALUES ---
  const answeredCount = useMemo(() => questions.filter(q => q.userAnswer).length, [questions]);
  const progressPercentage = useMemo(() => (questions.length > 0 ? (answeredCount / questions.length) * 100 : 0), [answeredCount, questions.length]);
  const allAnswered = questions.length > 0 && answeredCount === questions.length;
  const interactionsDisabled = isInReviewMode || quizCompleted;

  // --- LOADING STATE ---
  if (isLoading || loading) {
    return <LoadingSpinner isLoading={true} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link
                href="/practice"
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Luyện Nghe Từ Vựng</h1>
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
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Điểm: <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span> / {questions.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ResultModal
        isOpen={quizCompleted}
        score={score}
        totalQuestions={questions.length}
        onPlayAgain={resetQuiz}
        onReview={() => {
          setIsInReviewMode(true);
          setQuizCompleted(false);
        }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 text-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Nghe phát âm và viết từ vựng tương ứng</h2>
        </div>

        {questions.length > 0 ? (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Bài tập nghe</h2>
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <ListeningQuestion
                    key={q.id}
                    question={q}
                    index={index}
                    isInReviewMode={isInReviewMode}
                    interactionsDisabled={interactionsDisabled}
                    onAnswer={handleAnswer}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {sets.length === 0 ? "Bạn chưa có bộ từ vựng nào." : "Bộ từ vựng này không đủ từ để tạo bài tập."}
          </div>
        )}

        <div className="mt-8">
          {!isInReviewMode && questions.length > 0 && (
            <div className="text-center">
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
            </div>
          )}
          {isInReviewMode && (
            <div className="text-center">
              <button
                onClick={resetQuiz}
                className="px-6 py-2 rounded-lg text-base font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Làm lại bài tập
              </button>
            </div>
          )}
          <ProgressBar answeredCount={answeredCount} totalQuestions={questions.length} progressPercentage={progressPercentage} />
        </div>
      </div>
    </div>
  );
}