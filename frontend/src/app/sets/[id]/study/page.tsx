'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '~/hooks/useAuth';
import Link from 'next/link';
import axios from 'axios';
import LoadingSpinner from '~/components/LoadingSpinner';
import { Volume2, CheckCircle, ArrowLeft } from 'lucide-react';
import { axiosInstance } from '~/libs';

interface Term {
  _id?: string;
  term: string;
  definition: string;
  isLearned?: boolean;
}

interface Set {
  _id: string;
  title: string;
  description: string;
  terms: Term[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function StudySet() {
  const [set, setSet] = useState<Set | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animationDirection, setAnimationDirection] = useState<'next' | 'prev' | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [studyCompleted, setStudyCompleted] = useState(false);
  const { token, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const setId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    fetchSet();
  }, [isAuthenticated, router, setId]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        toggleDefinition();
      }
      else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevCard();
      }
      else if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextCard();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentCardIndex, showDefinition, set]);

  const fetchSet = async () => {
    try {
      const response = await axios.get(`/api/sets/${setId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSet(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (set && currentCardIndex < set.terms.length - 1) {
      setAnimationDirection('next');
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowDefinition(false);
        setAnimationDirection(null);
      }, 300);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setAnimationDirection('prev');
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex - 1);
        setShowDefinition(false);
        setAnimationDirection(null);
      }, 300);
    }
  };

  const toggleDefinition = () => {
    setShowDefinition(!showDefinition);
  };

  const speakText = (text: string) => {
    const detectLanguage = (text: string): string => {
      // Simple language detection - you can improve this
      const vietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
      return vietnameseChars.test(text) ? 'vi-VN' : 'en-US';
    };

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = detectLanguage(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const updateTermStatus = async (isLearned: boolean) => {
    if (!set || !set.terms[currentCardIndex]._id) return;
    const termId = set.terms[currentCardIndex]._id;
    setUpdatingStatus(true);
    try {
      const response = await axiosInstance.patch(`/api/sets/${setId}/terms/${termId}`, {
        isLearned
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the local state based on learning status
      const updatedTerms = [...set.terms];
      const currentTerm = updatedTerms[currentCardIndex];
      
      if (isLearned) {
        // Remove learned term from the list
        updatedTerms.splice(currentCardIndex, 1);
        
        // If we removed the last term, move to the previous one
        if (currentCardIndex >= updatedTerms.length && updatedTerms.length > 0) {
          setCurrentCardIndex(updatedTerms.length - 1);
        }
      } else {
        // Move unlearned term to the end of the list
        updatedTerms.splice(currentCardIndex, 1);
        updatedTerms.push({
          ...currentTerm,
          isLearned: false
        });
      }

      setSet({ ...set, terms: updatedTerms });

      // Check if all terms are learned
      if (updatedTerms.length === 0) {
        setStudyCompleted(true);
      }

      console.log('Term status updated:', response.data);
    } catch (err) {
      console.error('Error updating term status:', err);
      setError('Failed to update term status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <LoadingSpinner isLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Link href="/sets" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Back to Sets
          </Link>
        </div>
      </div>
    );
  }

  if (!set) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Set not found</h2>
          <Link href="/sets" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Back to Sets
          </Link>
        </div>
      </div>
    );
  }

  // Show completion message when all terms are learned
  if (studyCompleted || set.terms.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Chúc mừng! 🎉
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Bạn đã hoàn thành việc học bộ từ vựng "{set.title}" thành công!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
              Tất cả các từ vựng đã được ghi nhớ. Hãy tiếp tục học các bộ từ khác để mở rộng vốn từ của mình.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/sets"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại danh sách bộ từ
            </Link>
            
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = set.terms[currentCardIndex];

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6">
        <div className="flex items-center mb-4">
          <Link
            href={`/sets`}
            className="mr-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {set.title}
            </h1>
            {set.description && (
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                {set.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Thẻ {currentCardIndex + 1} / {set.terms.length}
          </span>
          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / set.terms.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex-shrink-0 flex justify-center mb-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center">
              <kbd className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-xs font-mono mr-2">SPACE</kbd>
              <span>Lật thẻ</span>
            </div>
            <div className="flex items-center">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-xs font-mono mr-2">←</kbd>
              <span>Trước</span>
            </div>
            <div className="flex items-center">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-xs font-mono mr-2">→</kbd>
              <span>Tiếp</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => speakText(showDefinition ? currentCard.definition : currentCard.term)}
                className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-200"
              >
                <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </button>
              <span className="ml-2">Phát âm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard - Centered */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-2xl h-80" style={{ perspective: '1000px' }}>
          <div 
            className={`relative w-full h-full cursor-pointer transition-transform duration-1000 ease-in-out hover:scale-105
              ${animationDirection === 'next' ? 'animate-slide-next' : ''}
              ${animationDirection === 'prev' ? 'animate-slide-prev' : ''}`}
            style={{ transformStyle: 'preserve-3d' }}
            onClick={toggleDefinition}
          >
            <div 
              className={`absolute inset-0 w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 text-center
                ${showDefinition ? 'rotate-y-180' : ''}`}
              style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <div className="mb-4">
                <svg className="w-12 h-12 text-indigo-500 mx-auto opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400 leading-relaxed">
                {currentCard.term}
              </p>
            </div>

            <div 
              className={`absolute inset-0 w-full h-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 text-center
                ${showDefinition ? '' : 'rotate-y-180'}`}
              style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              <div className="mb-4">
                <svg className="w-12 h-12 text-green-600 mx-auto opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400 leading-relaxed">
                {currentCard.definition}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Status Buttons - Fixed at bottom */}
      <div className="flex-shrink-0 p-6">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => updateTermStatus(false)}
            disabled={updatingStatus}
            className={`flex items-center space-x-2 px-8 py-4 rounded-lg font-medium transition-all duration-200 ${
              currentCard.isLearned === false
                ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-2 border-red-300 dark:border-red-700'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-300 border-2 border-transparent hover:border-red-300 dark:hover:border-red-700'
            } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-2xl">😟</span>
            <span className="text-lg">Chưa thuộc</span>
          </button>
          
          <button
            onClick={() => updateTermStatus(true)}
            disabled={updatingStatus}
            className={`flex items-center space-x-2 px-8 py-4 rounded-lg font-medium transition-all duration-200 ${
              currentCard.isLearned === true
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-2 border-green-300 dark:border-green-700'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-700 dark:hover:text-green-300 border-2 border-transparent hover:border-green-300 dark:hover:border-green-700'
            } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-2xl">😄</span>
            <span className="text-lg">Đã thuộc</span>
          </button>
        </div>
      </div>
      <style jsx>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        @keyframes slideNext {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateX(100%);
            opacity: 0;
          }
          51% {
            transform: translateX(-100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slidePrev {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateX(-100%);
            opacity: 0;
          }
          51% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-next {
          animation: slideNext 0.5s ease-in-out;
        }

        .animate-slide-prev {
          animation: slidePrev 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}