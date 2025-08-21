'use client';

import { useState, useEffect } from 'react';
import { Plus, X, ArrowLeft, Save, Eye, Trash2, BookOpen, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Card {
  term: string;
  definition: string;
}

export default function CreateSet() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState<Card[]>([
    { term: '', definition: '' },
    { term: '', definition: '' }
  ]);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    setToken(storedToken);
  }, []);

  const addCard = () => {
    const newCardIndex = cards.length;
    setCards([...cards, { term: '', definition: '' }]);
    
    setTimeout(() => {
      const termInput = document.querySelector(`input[data-card-index="${newCardIndex}"][data-field="term"]`) as HTMLInputElement;
      if (termInput) {
        termInput.focus();
        termInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const removeCard = (index: number) => {
    if (cards.length > 1) {
      setCards(cards.filter((_, i) => i !== index));
    }
  };

  const updateCard = (index: number, field: 'term' | 'definition', value: string) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleTabKey = (index: number, field: 'term' | 'definition', e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && field === 'definition' && index === cards.length - 1) {
      e.preventDefault();
      e.stopPropagation();
      
      const newCardIndex = cards.length;
      addCard();
      
      setTimeout(() => {
        const termInput = document.querySelector(`input[data-card-index="${newCardIndex}"][data-field="term"]`) as HTMLInputElement;
        if (termInput) {
          termInput.focus();
          termInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validation
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề cho bộ từ');
      return;
    }
  
    if (cards.some(card => !card.term.trim() || !card.definition.trim())) {
      setError('Vui lòng điền đầy đủ thông tin cho tất cả các thẻ');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post('/api/sets', {
        title,
        description,
        isPublic, 
        terms: cards,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.status !== 201) {
        const errorData = response.data;
        throw new Error(errorData.error || 'Đã xảy ra lỗi khi tạo bộ từ');
      }
      router.push('/sets');
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi gửi dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const filledCards = cards.filter(card => card.term.trim() && card.definition.trim()).length;
  const progress = Math.min((filledCards / Math.max(cards.length, 1)) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-600/10 dark:to-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link href="/sets" className="mr-4 p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border border-white/20 dark:border-gray-700/20">
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  Tạo bộ từ mới
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                  Tạo bộ từ vựng mới để học và ôn tập hiệu quả
                </p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tiến độ hoàn thành</div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 rounded-r-lg p-4 shadow-sm animate-shake">
            <div className="flex items-center">
              <X className="w-5 h-5 text-red-400 dark:text-red-300 mr-2" />
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Thông tin cơ bản
              </h2>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Tiêu đề bộ từ *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg placeholder-gray-400 dark:placeholder-gray-500 hover:border-gray-300 dark:hover:border-gray-500"
                    placeholder="Ví dụ: Từ vựng tiếng Anh cơ bản"
                    required
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Mô tả (tùy chọn)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 hover:border-gray-300 dark:hover:border-gray-500 resize-none"
                    placeholder="Mô tả ngắn về nội dung bộ từ này..."
                  />
                </div>

                <div className="flex items-center">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="sr-only"
                    />
                    <label htmlFor="isPublic" className="flex items-center cursor-pointer">
                      <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${isPublic ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isPublic ? 'translate-x-6' : 'translate-x-0.5'} translate-y-0.5`}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Công khai bộ từ này
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Thẻ từ vựng ({cards.length})
                </h2>
                <div className="text-white/80 dark:text-gray-300 text-sm">
                  Nhấn Tab ở ô "Định nghĩa" để tạo thẻ mới
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid gap-6">
                {cards.map((card, index) => (
                  <div key={index} className="group relative">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border-2 border-gray-100 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-indigo-400 transition-all duration-200 hover:shadow-md">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Thẻ từ {index + 1}</span>
                        </div>
                        
                        {cards.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCard(index)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Thuật ngữ *
                          </label>
                          <input
                            type="text"
                            value={card.term}
                            onChange={(e) => updateCard(index, 'term', e.target.value)}
                            onKeyDown={(e) => handleTabKey(index, 'term', e)}
                            data-card-index={index}
                            data-field="term"
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-500 dark:bg-gray-600 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-400 hover:border-gray-300 dark:hover:border-gray-400"
                            placeholder="Nhập thuật ngữ..."
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Định nghĩa *
                          </label>
                          <input
                            type="text"
                            value={card.definition}
                            onChange={(e) => updateCard(index, 'definition', e.target.value)}
                            onKeyDown={(e) => handleTabKey(index, 'definition', e)}
                            data-card-index={index}
                            data-field="definition"
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-500 dark:bg-gray-600 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-400 hover:border-gray-300 dark:hover:border-gray-400"
                            placeholder="Nhập định nghĩa..."
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Card Button */}
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={addCard}
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                >
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                  Thêm thẻ mới
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
              onClick={() => router.push('/sets')}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center min-w-40"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Tạo bộ từ
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}