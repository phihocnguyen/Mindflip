'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../hooks/authStore';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Link from 'next/link';
import { apiHelper } from '../../../libs/api';

interface MatchCard {
  id: string;
  term: string;
  definition: string;
  type: 'term' | 'definition';
  isMatched: boolean;
  isSelected: boolean;
  position: {
    x: number;
    y: number;
  };
}

interface Set {
  _id: string;
  title: string;
  description: string;
  terms: { term: string; definition: string }[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MatchGame() {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<MatchCard | null>(null);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sets, setSets] = useState<Set[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string>('');
  const [currentVocabulary, setCurrentVocabulary] = useState<{ term: string; definition: string }[]>([]);
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchSets();
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (selectedSetId && currentVocabulary.length > 0) {
      initializeGame();
    }
  }, [selectedSetId, currentVocabulary]);

  const fetchSets = async () => {
    try {
      setLoading(true);
      const response = await apiHelper.get<Set[]>('/api/sets');
      
      if (response.success && response.data) {
        setSets(response.data);
        if (response.data.length > 0) {
          const firstSetId = response.data[0]._id;
          setSelectedSetId(firstSetId);
          fetchVocabulary(firstSetId);
        }
      } else {
        setToastMessage({ type: 'error', message: 'Không thể tải danh sách bộ từ vựng' });
      }
    } catch (error) {
      setToastMessage({ type: 'error', message: 'Lỗi khi tải danh sách bộ từ vựng' });
    } finally {
      setLoading(false);
    }
  };

  const fetchVocabulary = async (setId: string) => {
    try {
      setLoading(true);
      const response = await apiHelper.get<{ term: string; definition: string }[]>(`/api/sets/${setId}/match-game?limit=10`);
      
      if (response.success && response.data) {
        setCurrentVocabulary(response.data);
      } else {
        setToastMessage({ type: 'error', message: 'Không thể tải từ vựng cho bộ này' });
      }
    } catch (error) {
      setToastMessage({ type: 'error', message: 'Lỗi khi tải từ vựng' });
    } finally {
      setLoading(false);
    }
  };

  const handleSetChange = (setId: string) => {
    setSelectedSetId(setId);
    if (setId) {
      fetchVocabulary(setId);
    }
  };

  const initializeGame = () => {
    if (currentVocabulary.length === 0) return;

    const shuffledVocabulary = [...currentVocabulary].sort(() => Math.random() - 0.5);
    const gameCards: MatchCard[] = [];
    
    // Tạo vị trí ngẫu nhiên với khoảng cách tối thiểu
    const generateRandomPosition = (existingPositions: { x: number; y: number }[]) => {
      let attempts = 0;
      let x: number, y: number;
      
      do {
        x = 10 + Math.random() * 70; // 10-80% để tránh edge
        y = 10 + Math.random() * 70;
        attempts++;
      } while (
        attempts < 100 && 
        existingPositions.some(pos => 
          Math.abs(pos.x - x) < 15 && Math.abs(pos.y - y) < 15
        )
      );
      
      return { x, y };
    };
    
    const usedPositions: { x: number; y: number }[] = [];
    
    shuffledVocabulary.forEach((item, index) => {
      // Tạo vị trí cho thẻ từ
      const termPosition = generateRandomPosition(usedPositions);
      usedPositions.push(termPosition);
      
      // Tạo vị trí cho thẻ định nghĩa
      const definitionPosition = generateRandomPosition(usedPositions);
      usedPositions.push(definitionPosition);
      
      // Thêm thẻ từ
      gameCards.push({
        id: `term-${index}`,
        term: item.term,
        definition: item.definition,
        type: 'term',
        isMatched: false,
        isSelected: false,
        position: termPosition,
      });
      
      // Thêm thẻ định nghĩa
      gameCards.push({
        id: `definition-${index}`,
        term: item.term,
        definition: item.definition,
        type: 'definition',
        isMatched: false,
        isSelected: false,
        position: definitionPosition,
      });
    });

    // Xáo trộn thứ tự các thẻ
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  };

  const handleCardClick = (card: MatchCard) => {
    if (card.isMatched || card.isSelected) return;

    if (!selectedCard) {
      // Chọn thẻ đầu tiên
      setCards(prev => prev.map(c => 
        c.id === card.id ? { ...c, isSelected: true } : c
      ));
      setSelectedCard(card);
    } else {
      // Chọn thẻ thứ hai
      if (selectedCard.id === card.id) {
        // Bỏ chọn nếu click lại cùng một thẻ
        setCards(prev => prev.map(c => 
          c.id === card.id ? { ...c, isSelected: false } : c
        ));
        setSelectedCard(null);
        return;
      }

      // Kiểm tra xem có phải là cặp đúng không
      if (selectedCard.term === card.term && selectedCard.definition === card.definition) {
        // Đúng cặp
        setCards(prev => prev.map(c => 
          c.term === card.term && c.definition === card.definition 
            ? { ...c, isMatched: true, isSelected: false }
            : c
        ));
        setMatchedPairs(prev => prev + 1);
        setToastMessage({ type: 'success', message: 'Chính xác! 🎉' });
        
        // Kiểm tra xem game đã hoàn thành chưa
        if (matchedPairs + 1 >= currentVocabulary.length) {
          setGameCompleted(true);
        }
      } else {
        // Sai cặp
        setCards(prev => prev.map(c => 
          c.id === card.id || c.id === selectedCard.id 
            ? { ...c, isSelected: true }
            : c
        ));
        setToastMessage({ type: 'error', message: 'Không đúng! Hãy thử lại' });
        
        // Ẩn thẻ sau 1 giây
        setTimeout(() => {
          setCards(prev => prev.map(c => ({ ...c, isSelected: false })));
        }, 1000);
      }
      
      setSelectedCard(null);
      
      // Ẩn thông báo sau 2 giây
      setTimeout(() => {
        setToastMessage(null);
      }, 2000);
    }
  };

  const resetGame = () => {
    setMatchedPairs(0);
    setGameCompleted(false);
    setSelectedCard(null);
    setToastMessage(null);
    if (currentVocabulary.length > 0) {
      initializeGame();
    }
  };

  const showLoading = isLoading || !isAuthenticated || loading;

  return (
    <>
      <LoadingSpinner isLoading={showLoading} />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link
                  href="/practice"
                  className="mr-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Match Game</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={selectedSetId}
                  onChange={(e) => {
                    handleSetChange(e.target.value);
                    resetGame();
                  }}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sets.map((set) => (
                    <option key={set._id} value={set._id}>
                      {set.title}
                    </option>
                  ))}
                </select>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Đã nối: <span className="font-semibold text-blue-600 dark:text-blue-400">{matchedPairs}</span> / {currentVocabulary.length}
                </div>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                >
                  Chơi lại
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Game Instructions */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nối từ với định nghĩa tương ứng
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Click vào một thẻ để chọn, sau đó click vào thẻ khác để nối. Nối đúng cặp sẽ biến mất!
            </p>
          </div>

          {/* Toast Message */}
          {toastMessage && (
            <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
              toastMessage.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              <div className="flex items-center">
                <span className="mr-2">
                  {toastMessage.type === 'success' ? '✅' : '❌'}
                </span>
                <p className="font-medium">{toastMessage.message}</p>
              </div>
            </div>
          )}

          {/* Game Completed Modal */}
          {gameCompleted && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Chúc mừng! 🎉
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Bạn đã hoàn thành tất cả các cặp từ vựng!
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={resetGame}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    >
                      Chơi lại
                    </button>
                    <Link
                      href="/practice"
                      className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 text-center"
                    >
                      Về trang chính
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Game Grid */}
          {currentVocabulary.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                {loading ? 'Đang tải từ vựng...' : 'Chọn một bộ từ vựng để bắt đầu'}
              </div>
            </div>
          ) : (
            <div className="w-full">
              {/* Mobile Grid Layout */}
              <div className="md:hidden">
                <div className="grid grid-cols-2 gap-3 bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(card)}
                      className={`
                        aspect-square rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-center p-2 text-center
                        ${card.isMatched 
                          ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700 opacity-50' 
                          : card.isSelected 
                            ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-lg scale-105' 
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="text-xs font-medium text-gray-900 dark:text-white leading-tight">
                        {card.type === 'term' ? card.term : card.definition}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Random Layout */}
              <div className="hidden md:block relative w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                {cards.map((card) => {
                  return (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(card)}
                      style={{
                        position: 'absolute',
                        left: `${card.position.x}%`,
                        top: `${card.position.y}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: card.isSelected ? 10 : 1,
                      }}
                      className={`
                        w-24 h-24 rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-center p-2 text-center
                        ${card.isMatched 
                          ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700 opacity-50' 
                          : card.isSelected 
                            ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-lg scale-105' 
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="text-xs font-medium text-gray-900 dark:text-white leading-tight">
                        {card.type === 'term' ? card.term : card.definition}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${currentVocabulary.length > 0 ? (matchedPairs / currentVocabulary.length) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
              Tiến độ: {Math.round(currentVocabulary.length > 0 ? (matchedPairs / currentVocabulary.length) * 100 : 0)}%
            </div>
          </div>
        </div>
      </div>
    </>
  );
}