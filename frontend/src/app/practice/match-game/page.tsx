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
  isWrong?: boolean; // Thêm thuộc tính isWrong để theo dõi lỗi
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
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
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

  // Ensure initializeGame runs when currentVocabulary changes
  useEffect(() => {
    if (currentVocabulary.length > 0) {
      console.log('currentVocabulary updated, calling initializeGame:', currentVocabulary);
      initializeGame();
    }
  }, [currentVocabulary]);

  useEffect(() => {
    if (cards.length > 0 && !gameCompleted) {
      setGameStartTime(Date.now());
    }
  }, [cards.length]);

  useEffect(() => {
    if (gameCompleted && selectedSetId) {
      let durationSeconds = 0;
      if (gameStartTime) {
        durationSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
      }
      apiHelper.post('/api/logs', {
        setId: selectedSetId,
        activityType: 'MATCHING',
        durationSeconds,
        correctAnswers: matchedPairs,
        totalItems: currentVocabulary.length
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCompleted]);

  const fetchSets = async () => {
    try {
      setLoading(true);
      const response = await apiHelper.get<Set[]>('/api/sets');
      
      if (response.success && response.data && response.data.length > 0) {
        setSets(response.data);
        const firstSetId = response.data[0]._id;
        setSelectedSetId(firstSetId);
        await fetchVocabulary(firstSetId);
      } else {
        setToastMessage({ type: 'error', message: 'Không có bộ từ vựng nào để chơi' });
        setLoading(false);
      }
    } catch (error) {
      setToastMessage({ type: 'error', message: 'Lỗi khi tải danh sách bộ từ vựng' });
      setLoading(false);
    }
  };

  const fetchVocabulary = async (setId: string) => {
    try {
      setLoading(true);
      const response = await apiHelper.get<{ term: string; definition: string }[]>(`/api/sets/${setId}/random-terms?limit=10`);
      
      console.log('API response for match-game:', response); // Debug: Log full response
      if (response.success && response.data) {
        console.log('Setting currentVocabulary:', response.data); // Debug: Log data
        setCurrentVocabulary(response.data);
        if (response.data.length === 0) {
          setToastMessage({ type: 'error', message: 'Bộ từ vựng này không có từ nào' });
        }
      } else {
        setToastMessage({ type: 'error', message: 'Không thể tải từ vựng cho bộ này' });
      }
    } catch (error) {
      console.error('Error fetching vocabulary:', error); // Debug: Log error
      setToastMessage({ type: 'error', message: 'Lỗi khi tải từ vựng' });
    } finally {
      setLoading(false);
    }
  };

  const handleSetChange = (setId: string) => {
    setSelectedSetId(setId);
    resetGame();
    if (setId) {
      fetchVocabulary(setId);
    }
  };

  const initializeGame = () => {
    if (currentVocabulary.length === 0) {
      console.log('No vocabulary to initialize game');
      return;
    }
  
    console.log('Initializing game with vocabulary:', currentVocabulary);
    const shuffledVocabulary = [...currentVocabulary].sort(() => Math.random() - 0.5);
    const gameCards: MatchCard[] = [];
    
    const generateRandomPosition = (existingPositions: { x: number; y: number }[]) => {
      let attempts = 0;
      let x: number, y: number;
      
      do {
        x = 5 + Math.random() * 90; // 5% to 95% of width
        y = 5 + Math.random() * 90; // Adjusted to 5% to 95% of 600px height
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
      const termPosition = generateRandomPosition(usedPositions);
      usedPositions.push(termPosition);
      
      const definitionPosition = generateRandomPosition(usedPositions);
      usedPositions.push(definitionPosition);
      
      gameCards.push({
        id: `term-${index}`,
        term: item.term,
        definition: item.definition,
        type: 'term',
        isMatched: false,
        isSelected: false,
        position: termPosition,
      });
      
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
  
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    console.log('Generated cards:', shuffledCards);
    setCards(shuffledCards);
  };

  const handleCardClick = (card: MatchCard) => {
    if (card.isMatched || card.isSelected) return;
  
    if (!selectedCard) {
      setCards(prev => prev.map(c => 
        c.id === card.id ? { ...c, isSelected: true } : c
      ));
      setSelectedCard(card);
    } else {
      if (selectedCard.id === card.id) {
        setCards(prev => prev.map(c => 
          c.id === card.id ? { ...c, isSelected: false } : c
        ));
        setSelectedCard(null);
        return;
      }
  
      if (selectedCard.term === card.term && selectedCard.definition === card.definition) {
        setCards(prev => prev.map(c => 
          c.term === card.term && c.definition === card.definition 
            ? { ...c, isMatched: true, isSelected: false }
            : c
        ));
        setMatchedPairs(prev => prev + 1);
        setToastMessage({ type: 'success', message: 'Chính xác! 🎉' });
        
        if (matchedPairs + 1 >= currentVocabulary.length) {
          setGameCompleted(true);
        }
      } else {
        setCards(prev => prev.map(c => 
          c.id === card.id || c.id === selectedCard.id 
            ? { ...c, isSelected: true, isWrong: true } // Đánh dấu sai
            : c
        ));
        setToastMessage({ type: 'error', message: 'Không đúng! Hãy thử lại' });
        
        setTimeout(() => {
          setCards(prev => prev.map(c => ({ ...c, isSelected: false, isWrong: false })));
        }, 1000);
      }
      
      setSelectedCard(null);
      
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
    setGameStartTime(null);
    if (currentVocabulary.length > 0) {
      initializeGame();
    }
  };

  const showLoading = isLoading || !isAuthenticated || loading;

  // Debug: Log state before rendering
  console.log('Render state:', { sets, currentVocabulary, cards, selectedSetId });

  if (showLoading) {
    return <LoadingSpinner isLoading={true} />;
  }

  return (
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
              {sets.length > 0 && (
                <select
                  value={selectedSetId}
                  onChange={(e) => handleSetChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sets.map((set) => (
                    <option key={set._id} value={set._id}>
                      {set.title}
                    </option>
                  ))}
                </select>
              )}
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
  
        {/* Game Grid or No Data Message */}
        {sets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              Không có bộ từ vựng nào để chơi
            </div>
          </div>
        ) : currentVocabulary.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              Bộ từ vựng này không có từ nào
            </div>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              Đang tải thẻ... Vui lòng chờ
            </div>
          </div>
        ) : (
          <div className="w-full">
            {/* Mobile Grid Layout */}
            <div className="md:hidden">
              <div className="grid grid-cols-2 gap-3 bg-gray-100 dark:bg-gray-800 rounded-xl p-4" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {cards.filter(card => !card.isMatched).map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className={`
                      aspect-square rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-center p-2 text-center
                      ${card.isSelected ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 shadow-lg scale-105' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'}
                      ${card.isWrong ? 'bg-red-100 dark:bg-red-900/20 border-[#FF0000] dark:border-red-400' : ''}
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
            <div className="hidden md:block relative w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-xl p-4" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {cards.filter(card => !card.isMatched).map((card) => (
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
                    ${card.isSelected ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 shadow-lg scale-105' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'}
                    ${card.isWrong ? 'bg-red-100 dark:bg-red-900/20 border-[#FF0000] dark:border-red-400' : ''}
                  `}
                >
                  <div className="text-xs font-medium text-gray-900 dark:text-white leading-tight">
                    {card.type === 'term' ? card.term : card.definition}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
  
        {/* Progress Bar */}
        {currentVocabulary.length > 0 && (
          <div className="mt-8">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(matchedPairs / currentVocabulary.length) * 100}%`