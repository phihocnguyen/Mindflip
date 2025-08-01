'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '~/hooks/authStore';
import Link from 'next/link';
import axios from 'axios';
import LoadingSpinner from '~/components/LoadingSpinner';
import { Volume2 } from 'lucide-react';

interface Term {
  term: string;
  definition: string;
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
  const { token, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const setId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
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
    const utterance = new SpeechSynthesisUtterance(text);
    const detectLanguage = (text: string): string => {
      const textLower = text.toLowerCase();
      if (/[\u0400-\u04FF]/.test(text)) return 'ru-RU'; // Russian
      if (/[\u4E00-\u9FFF]/.test(text)) return 'zh-CN'; // Chinese
      if (/[\u3040-\u30FF]/.test(text)) return 'ja-JP'; // Japanese
      if (/[\uAC00-\uD7AF]/.test(text)) return 'ko-KR'; // Korean
      if (/[\u0600-\u06FF]/.test(text)) return 'ar-SA'; // Arabic
      if (/[ăâêôơưđáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụýỳỷỹỵ]/.test(textLower)) {
        return 'vi-VN'; // ✅ Vietnamese
      }
      if (/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþ]/.test(text)) {
        if (/[ñ]/.test(textLower)) return 'es-ES';
        if (/[ç]/.test(textLower)) return 'fr-FR';
        return 'en-US';
      }
      return 'en-US';
    };
  
    utterance.lang = detectLanguage(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };
  

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner isLoading={true}/>
      </div>
    );
  }

  if (error || !set) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Không tìm thấy bộ từ
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Quay lại Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = set.terms[currentCardIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/sets"
              className="mr-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {set.title}
              </h1>
              {set.description && (
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {set.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
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

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl h-96" style={{ perspective: '1000px' }}>
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

        <div className="flex justify-center mb-6">
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