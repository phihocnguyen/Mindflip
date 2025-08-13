'use client';

import { useState } from 'react';

interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  exampleSentence?: string;
}

interface VocabularyCollectionClientProps {
  vocabularyWords: VocabularyWord[];
  onRemoveWord: (id: string) => void;
  onCreateSet: () => void;
}

export default function VocabularyCollectionClient({ 
  vocabularyWords, 
  onRemoveWord, 
  onCreateSet 
}: VocabularyCollectionClientProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null; // Không render gì khi đóng
  }

  return (
    <div 
      className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-40 border-l border-gray-200 dark:border-gray-700"
      style={{ maxHeight: '100vh', overflow: 'hidden' }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Bộ sưu tập từ vựng
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
            aria-label="Đóng thanh bên"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800">
          {vocabularyWords.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Chưa có từ vựng</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Chọn từ trong bài viết để thêm vào bộ sưu tập.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {vocabularyWords.map((word) => (
                <div 
                  key={word.id} 
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {word.word}
                    </h3>
                    <button
                      onClick={() => onRemoveWord(word.id)}
                      className="text-gray-400 hover:text-red-500 ml-2 flex-shrink-0"
                      aria-label="Xóa từ"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {word.translation}
                  </p>
                  {word.exampleSentence && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                      "{word.exampleSentence}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            onClick={onCreateSet}
            disabled={vocabularyWords.length === 0}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
              vocabularyWords.length === 0
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Tạo bộ từ vựng ({vocabularyWords.length})
          </button>
        </div>
      </div>
    </div>
  );
}
