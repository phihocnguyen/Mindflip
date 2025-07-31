'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '../../../../hooks/authStore';
import Link from 'next/link';

interface Card {
  term: string;
  definition: string;
}

interface Set {
  _id: string;
  title: string;
  description: string;
  cards: Card[];
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
  const { isAuthenticated } = useAuthStore();
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

  const fetchSet = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/sets/${setId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch set');
      }

      const data = await response.json();
      setSet(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (set && currentCardIndex < set.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowDefinition(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowDefinition(false);
    }
  };

  const toggleDefinition = () => {
    setShowDefinition(!showDefinition);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
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

  const currentCard = set.cards[currentCardIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/dashboard"
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
          
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Thẻ {currentCardIndex + 1} / {set.cards.length}
            </span>
            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentCardIndex + 1) / set.cards.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="flex justify-center mb-8">
          <div 
            className="w-full max-w-2xl h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={toggleDefinition}
          >
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-4">
                <svg className="w-12 h-12 text-indigo-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              {!showDefinition ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Thuật ngữ
                  </h2>
                  <p className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">
                    {currentCard.term}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Nhấp để xem định nghĩa
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Định nghĩa
                  </h2>
                  <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                    {currentCard.definition}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Nhấp để xem thuật ngữ
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Trước
            </span>
          </button>
          
          <button
            onClick={toggleDefinition}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {showDefinition ? 'Xem thuật ngữ' : 'Xem định nghĩa'}
          </button>
          
          <button
            onClick={nextCard}
            disabled={currentCardIndex === set.cards.length - 1}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center">
              Tiếp
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>

        {/* Completion Message */}
        {currentCardIndex === set.cards.length - 1 && (
          <div className="mt-8 text-center">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                Chúc mừng! 🎉
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Bạn đã hoàn thành bộ từ "{set.title}"
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Quay lại Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 