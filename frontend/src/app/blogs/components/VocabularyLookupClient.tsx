'use client';

import { useState, useEffect, useRef } from 'react';
import { translateWordWithExample, TranslationResult } from '../../../libs/openrouter';

interface VocabularyLookupClientProps {
  onAddWord: (word: string, translation: string, exampleSentence?: string) => void;
}

export default function VocabularyLookupClient({ onAddWord }: VocabularyLookupClientProps) {
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleSelection = () => {
      // Clear any existing timeout
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }

      // Set a new timeout to process selection after a short delay
      selectionTimeoutRef.current = setTimeout(() => {
        const selection = window.getSelection();
        if (!selection) return;

        const selectionText = selection.toString().trim();
        
        // Kiểm tra nếu selection nằm trong popup thì không xử lý
        const selectionAnchor = selection.anchorNode;
        if (selectionAnchor && popupRef.current && popupRef.current.contains(selectionAnchor)) {
          return;
        }

        if (selectionText && selectionText.split(/\s+/).length <= 3) {
          // Luôn cập nhật selection mới
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setSelectionPosition({
            x: rect.right, // Xuất hiện bên phải từ được chọn
            y: rect.top    // Căn chỉnh theo phía trên của từ
          });
          setSelectedText(selectionText);
          fetchTranslation(selectionText);
        } else if (!selectionText) {
          // Chỉ reset nếu không có selection text
          setSelectedText('');
        }
      }, 300); // Delay 300ms để đợi người dùng quét xong
    };
    
    const handleMouseDown = (event: MouseEvent) => {
      // Reset selection khi click ra ngoài popup
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setSelectedText('');
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('selectionchange', handleSelection);
      document.removeEventListener('mousedown', handleMouseDown);
      // Clear timeout on unmount
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, []);

  const fetchTranslation = async (text: string) => {
    setLoading(true);
    setError(null);
    setTranslation(null);
    try {
      const result = await translateWordWithExample(text);
      setTranslation(result);
    } catch (err: any) {
      console.error('Translation error:', err);
      setError('Không thể dịch từ này. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedText('');
  };

  const handleAddToCollection = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (translation) {
      onAddWord(
        translation.word,
        translation.translation,
        translation.exampleSentence
      );
      setSelectedText('');
    }
  };
  
  if (!selectedText) return null;

  return (
    <div
      className="fixed top-0 left-0 w-0 h-0 z-50"
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '0',
        height: '0',
        zIndex: 1000
      }}
    >
      <div
        ref={popupRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-80 max-w-[90vw]"
        style={{
          position: 'absolute',
          left: `${selectionPosition.x + 10}px`, // 10px khoảng cách từ từ
          top: `${selectionPosition.y}px`,
          zIndex: 1001
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div>
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <button onClick={handleClose} className="flex-1 w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors duration-200">Đóng</button>
          </div>
        ) : translation ? (
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {translation.word}
              </h3>
            </div>
            <div className="mb-4">
              <div className="mb-3">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Bản dịch</span>
                <div className="mt-1">
                  <p className="text-gray-700 dark:text-gray-300">{translation.translation}</p>
                </div>
              </div>
              <div className="mb-3">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Ví dụ</span>
                <div className="mt-1">
                  <p className="text-gray-700 dark:text-gray-300 italic">"{translation.exampleSentence}"</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={handleAddToCollection} className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">Thêm vào Bộ sưu tập</button>
              <button onClick={handleClose} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors duration-200">Đóng</button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Không tìm thấy bản dịch cho "{selectedText}"</p>
            <div className="flex space-x-2">
              <button onClick={handleClose} className="flex-1 w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors duration-200">Đóng</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}