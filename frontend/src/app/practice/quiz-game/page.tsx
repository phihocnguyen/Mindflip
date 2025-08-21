'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../../../hooks/useAuth';
import Sidebar from '../../../components/Sidebar';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { apiHelper } from '../../../libs/api';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- INTERFACES ---
interface VocabularyTerm {
  term: string;
  definition: string;
}

interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple_choice';
  questionText: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
}

interface DragDropQuestion {
  id: string;
  type: 'drag_drop';
  definition: string;
  correctAnswer: string;
  userAnswer?: string;
}

interface TrueFalseQuestion {
  id: string;
  type: 'true_false';
  questionText: string;
  correctAnswer: 'Đúng' | 'Sai';
  userAnswer?: 'Đúng' | 'Sai';
}

type QuizQuestion = MultipleChoiceQuestion | DragDropQuestion | TrueFalseQuestion;

interface Set {
  _id: string;
  title: string;
  terms: VocabularyTerm[];
}

export default function QuizGame() {
  // --- STATE MANAGEMENT ---
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isInReviewMode, setIsInReviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sets, setSets] = useState<Set[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string>('');
  const [wordLimit, setWordLimit] = useState<number>(20);
  const [currentVocabulary, setCurrentVocabulary] = useState<VocabularyTerm[]>([]);
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);

  // --- LOGIC FETCH DỮ LIỆU ---
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    fetchSets();
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (currentVocabulary.length > 0) {
      initializeQuiz();
    } else {
      setQuestions([]);
    }
  }, [currentVocabulary]);

  useEffect(() => {
    if (questions.length > 0 && !quizCompleted) {
      setQuizStartTime(Date.now());
    }
  }, [questions.length]);

  const fetchSets = async () => {
    try {
      setLoading(true);
      const response = await apiHelper.get<Set[]>('/api/sets');
      if (response.success && response.data && response.data.length > 0) {
        setSets(response.data);
        const firstSetId = response.data[0]._id;
        setSelectedSetId(firstSetId);
        await fetchVocabulary(firstSetId, wordLimit);
      } else {
        setCurrentVocabulary([]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch sets:", error);
      setLoading(false);
    }
  };

  const fetchVocabulary = async (setId: string, limit: number) => {
    try {
      setLoading(true);
      const response = await apiHelper.get<VocabularyTerm[]>(`/api/sets/${setId}/random-terms?limit=${limit}`);
      if (response.success && response.data) {
        if (response.data.length < 4) {
          toast.error(`Bộ từ vựng này chỉ có ${response.data.length} từ. Cần ít nhất 4 từ để tạo quiz.`);
          setCurrentVocabulary([]);
        } else {
          setCurrentVocabulary(response.data);
        }
      } else {
        setCurrentVocabulary([]);
      }
    } catch (error) {
      console.error("Failed to fetch vocabulary:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC KHỞI TẠO QUIZ ---
  const initializeQuiz = () => {
    if (currentVocabulary.length < 4) return;
    const shuffledVocab = [...currentVocabulary].sort(() => Math.random() - 0.5);
    const totalQuestions = shuffledVocab.length;

    const mcCount = Math.round(totalQuestions * 0.4);
    const tfCount = Math.round(totalQuestions * 0.3);
    const ddCount = totalQuestions - mcCount - tfCount;

    const newQuestions: QuizQuestion[] = [];

    const mcVocab = shuffledVocab.slice(0, mcCount);
    mcVocab.forEach((termData, index) => {
      const otherDefs = currentVocabulary.filter(v => v.term !== termData.term).map(v => v.definition);
      const incorrectOptions = [...otherDefs].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [termData.definition, ...incorrectOptions].sort(() => Math.random() - 0.5);
      newQuestions.push({
        id: `mc-${index}`, type: 'multiple_choice', questionText: termData.term,
        options, correctAnswer: termData.definition,
      });
    });

    const tfVocab = shuffledVocab.slice(mcCount, mcCount + tfCount);
    tfVocab.forEach((termData, index) => {
      let questionText = `"${termData.term}" có nghĩa là `;
      let correctAnswer: 'Đúng' | 'Sai';
      if (Math.random() > 0.5 || currentVocabulary.length < 2) {
        questionText += `"${termData.definition}"`;
        correctAnswer = 'Đúng';
      } else {
        const otherDefs = currentVocabulary.filter(v => v.definition !== termData.definition);
        const randomIncorrectDef = otherDefs[Math.floor(Math.random() * otherDefs.length)].definition;
        questionText += `"${randomIncorrectDef}"`;
        correctAnswer = 'Sai';
      }
      newQuestions.push({
        id: `tf-${index}`, type: 'true_false', questionText, correctAnswer,
      });
    });

    const ddVocab = shuffledVocab.slice(mcCount + tfCount);
    ddVocab.forEach((termData, index) => {
      newQuestions.push({
        id: `dd-${index}`, type: 'drag_drop', definition: termData.definition,
        correctAnswer: termData.term,
      });
    });
    setQuestions(newQuestions.sort(() => Math.random() - 0.5));
  };

  // --- LOGIC XỬ LÝ GAME ---
  const handleAnswer = (questionId: string, answer: any) => {
    if (isInReviewMode || quizCompleted) return;
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, userAnswer: answer } : q));
  };

  const handleRemoveDragDropAnswer = (questionId: string) => {
    if (isInReviewMode || quizCompleted) return;
    setQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, userAnswer: undefined } : q
    ));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, questionId: string) => {
    e.preventDefault();
    if (isInReviewMode || quizCompleted) return;
    if (dragItem) {
      handleAnswer(questionId, dragItem);
      setDragItem(null);
    }
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    questions.forEach(q => { if (q.userAnswer === q.correctAnswer) correctCount++; });
    setScore(correctCount);
    setQuizCompleted(true);

    // Calculate duration
    let durationSeconds = 0;
    if (quizStartTime) {
      durationSeconds = Math.floor((Date.now() - quizStartTime) / 1000);
    }

    // Call /api/logs
    if (selectedSetId) {
      await apiHelper.post('/api/logs', {
        setId: selectedSetId,
        activityType: 'QUIZ',
        durationSeconds,
        correctAnswers: correctCount,
        totalItems: questions.length
      });
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setQuizCompleted(false);
    setIsInReviewMode(false);
    setQuizStartTime(Date.now());
    if (currentVocabulary.length > 0) {
      initializeQuiz();
    }
  };

  const handleSetChange = (setId: string) => {
    setSelectedSetId(setId);
  };

  // CẬP NHẬT HÀM NÀY
  const handleApplyChanges = () => {
    if (selectedSetId) {
      setQuizCompleted(false);
      setIsInReviewMode(false);
      setScore(0);
      setQuestions([]); // Xóa câu hỏi cũ để kích hoạt LoadingSpinner toàn trang
      fetchVocabulary(selectedSetId, wordLimit);
    }
  };

  // --- BIẾN PHỤ VÀ MEMOIZATION ---
  const mcQuestions = useMemo(() => questions.filter((q): q is MultipleChoiceQuestion => q.type === 'multiple_choice'), [questions]);
  const tfQuestions = useMemo(() => questions.filter((q): q is TrueFalseQuestion => q.type === 'true_false'), [questions]);
  const ddQuestions = useMemo(() => questions.filter((q): q is DragDropQuestion => q.type === 'drag_drop'), [questions]);

  const ddTermBank = useMemo(() => ddQuestions.map(q => q.correctAnswer).sort(() => Math.random() - 0.5), [ddQuestions]);
  const usedDragAndDropAnswers = new Set(ddQuestions.map(q => q.userAnswer).filter(Boolean));

  const answeredCount = questions.filter(q => q.userAnswer).length;
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const allAnswered = questions.length > 0 && answeredCount === questions.length;
  const interactionsDisabled = isInReviewMode || quizCompleted;

  // CẬP NHẬT ĐIỀU KIỆN LOADING CHÍNH
  const showFullPageLoading = isLoading || (loading && questions.length === 0);
  if (showFullPageLoading) {
    return <LoadingSpinner isLoading={true} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/practice" className="mr-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Tổng Hợp</h1>
            </div>
            <div className="flex items-center space-x-4">
              {sets.length > 0 && (
                <>
                  <select value={selectedSetId} onChange={(e) => handleSetChange(e.target.value)} disabled={loading} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70">
                    {sets.map((set) => (<option key={set._id} value={set._id}>{set.title}</option>))}
                  </select>
                  <select value={wordLimit} onChange={(e) => setWordLimit(Number(e.target.value))} disabled={loading} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70">
                    <option value={10}>10 từ</option>
                    <option value={20}>20 từ</option>
                    <option value={30}>30 từ</option>
                    <option value={40}>40 từ</option>
                    <option value={50}>50 từ</option>
                  </select>
                  {/* CẬP NHẬT NÚT ÁP DỤNG */}
                  <button onClick={handleApplyChanges} disabled={loading} className="px-4 py-2 w-32 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed">
                    Áp dụng
                  </button>
                </>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Điểm: <span className="font-semibold text-blue-600 dark:text-blue-400">{score}</span> / {questions.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {quizCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Chúc mừng! 🎉</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Bạn đã hoàn thành bài quiz với điểm số: {score}/{questions.length}</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button onClick={resetQuiz} className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-lg transition-colors font-semibold">Chơi lại</button>
              <button onClick={() => { setIsInReviewMode(true); setQuizCompleted(false); }} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold">Xem lại bài làm</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center"><h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Hoàn thành các câu hỏi dưới đây</h2></div>

        {questions.length > 0 ? (
          <div className="space-y-12">
            {mcQuestions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Phần 1: Trắc nghiệm</h2>
                <div className="space-y-6">
                  {mcQuestions.map((q, index) => {
                    const isCorrect = isInReviewMode && q.userAnswer === q.correctAnswer;
                    const isWrong = isInReviewMode && q.userAnswer !== q.correctAnswer;
                    return (
                      <div key={q.id}>
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          {index + 1}. Từ vựng: <span className="text-blue-600 dark:text-blue-400">{q.questionText}</span>
                          {isWrong && <span className="ml-2 text-sm font-normal text-red-500">(Sai)</span>}
                          {isCorrect && <span className="ml-2 text-sm font-normal text-green-500">(Đúng)</span>}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map(option => {
                            let optionClass = 'bg-gray-100 dark:bg-gray-700 border-transparent hover:border-blue-500 dark:text-gray-200';
                            if (isInReviewMode) {
                              if (option === q.correctAnswer) optionClass = 'bg-green-600 border-green-700 text-white';
                              else if (option === q.userAnswer) optionClass = 'bg-red-600 border-red-700 text-white';
                              else optionClass = 'bg-gray-100 dark:bg-gray-700 border-transparent opacity-50 cursor-default dark:text-gray-200';
                            } else if (q.userAnswer === option) {
                              optionClass = 'bg-blue-600 text-white';
                            }
                            return <button key={option} onClick={() => handleAnswer(q.id, option)} disabled={interactionsDisabled} className={`p-3 rounded-lg text-left transition-all duration-200 ${optionClass}`}>{option}</button>
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            
            {tfQuestions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Phần 2: Đúng hay Sai</h2>
                <div className="space-y-6">
                  {tfQuestions.map((q, index) => {
                    const isCorrect = isInReviewMode && q.userAnswer === q.correctAnswer;
                    const isWrong = isInReviewMode && q.userAnswer !== q.correctAnswer;
                    return (
                      <div key={q.id}>
                        <p className="text-lg text-gray-800 dark:text-gray-200 mb-3">
                          {mcQuestions.length + index + 1}. {q.questionText}
                          {isWrong && <span className="ml-2 text-sm font-normal text-red-500">(Sai)</span>}
                          {isCorrect && <span className="ml-2 text-sm font-normal text-green-500">(Đúng)</span>}
                        </p>
                        <div className="flex items-center space-x-4">
                          {(['Đúng', 'Sai'] as const).map(option => {
                              let optionClass = 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:text-gray-200';
                              if (isInReviewMode) {
                                  if (option === q.correctAnswer) optionClass = 'bg-green-600 text-white';
                                  else if (option === q.userAnswer) optionClass = 'bg-red-600 text-white';
                                  else optionClass = 'bg-gray-200 dark:bg-gray-700 opacity-50 dark:text-gray-200';
                              } else if (q.userAnswer === option) {
                                  optionClass = 'bg-blue-600 text-white';
                              }
                              return <button key={option} onClick={() => handleAnswer(q.id, option)} disabled={interactionsDisabled} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${optionClass}`}>{option}</button>
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {ddQuestions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Phần 3: Kéo thả</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Định nghĩa</h3>
                    <div className="space-y-3">
                      {ddQuestions.map((q) => {
                        const isCorrect = q.userAnswer === q.correctAnswer;
                        let dropZoneClass = 'border-gray-400 dark:border-gray-600 hover:border-blue-500';
                        if (isInReviewMode) {
                          if(isCorrect) dropZoneClass = 'border-green-500 bg-green-100 dark:bg-green-900/30 font-semibold';
                          else dropZoneClass = 'border-red-500 bg-red-100 dark:bg-red-900/30 font-semibold';
                        } else if (q.userAnswer) {
                          dropZoneClass = 'border-blue-500 bg-blue-100 dark:bg-blue-900/30 font-semibold dark:text-gray-200';
                        }
                        return (
                          <div key={q.id}>
                            <div className="flex items-center gap-4">
                              <div onClick={() => q.userAnswer && handleRemoveDragDropAnswer(q.id)} onDrop={(e) => handleDrop(e, q.id)} onDragOver={(e) => e.preventDefault()} className={`group relative flex-shrink-0 w-48 h-14 flex items-center justify-center dark:text-gray-200 p-2 border-2 border-dashed rounded-lg text-center transition-all duration-200 ${dropZoneClass} ${q.userAnswer && !interactionsDisabled ? 'cursor-pointer' : ''}`}>
                                {q.userAnswer || 'Thả vào đây'}
                                {q.userAnswer && !interactionsDisabled && (<button onClick={(e) => { e.stopPropagation(); handleRemoveDragDropAnswer(q.id); }} className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-all"><X size={12} /></button>)}
                              </div>
                              <p className="text-gray-800 dark:text-gray-200">{q.definition}</p>
                            </div>
                            {isInReviewMode && !isCorrect && (<div className="pl-52 -mt-2 text-sm text-green-600 dark:text-green-500">Đáp án đúng: <span className="font-bold">{q.correctAnswer}</span></div>)}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ngân hàng từ vựng</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {ddTermBank.filter(term => !usedDragAndDropAnswers.has(term)).map(term => (<div key={term} draggable={!interactionsDisabled} onDragStart={(e) => !interactionsDisabled && setDragItem(term)} className={`p-3 bg-white dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm text-center dark:text-gray-200 transition-all duration-200 ${interactionsDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-move hover:shadow-md'}`}>{term}</div>))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {sets.length === 0 ? "Bạn chưa có bộ từ vựng nào." : "Bộ từ vựng này không đủ từ để tạo quiz (cần ít nhất 4 từ)."}
          </div>
        )}

        <div className="mt-12">
          {(!isInReviewMode && questions.length > 0) && (
            <div className="text-center"><button onClick={handleSubmit} disabled={!allAnswered} className={`px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 ${allAnswered ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'}`}>Nộp bài</button></div>
          )}
          {isInReviewMode && (
              <div className="text-center"><button onClick={resetQuiz} className="px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white shadow-lg">Làm lại Quiz</button></div>
          )}
          {questions.length > 0 && (
            <div className="mt-8 max-w-xl mx-auto">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4"><div className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div></div>
              <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">Tiến độ: {answeredCount} / {questions.length} ({Math.round(progressPercentage)}%)</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}