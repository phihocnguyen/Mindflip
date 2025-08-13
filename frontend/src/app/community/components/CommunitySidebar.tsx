'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../hooks/useAuth';
import { axiosInstance } from '~/libs';
import Link from 'next/link';

interface TopUser {
  _id: string;
  name: string;
  avatar?: string;
  totalScore: number;
}

interface TopPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  interactionScore: number;
}

interface CommunitySidebarProps {
  onTopicClick: (postId: string) => void;
}


export default function CommunitySidebar({ onTopicClick }: CommunitySidebarProps) {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TopPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchSidebarData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchSidebarData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/community/leaderboard');
      const data = response.data.data
      if (data) {
        setTopUsers(data.topUsers);
        setTrendingTopics(data.topPosts);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu sidebar:', error);
      setTopUsers([]);
      setTrendingTopics([]);
    } finally {
      setLoading(false);
    }
  };


  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'TOEIC': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'IELTS': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Giao tiếp': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Mẹo học tập': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Users */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🏆 Top thành viên
        </h3>
        
        <div className="space-y-3">
          {topUsers.map((user, index) => (
            <div key={user._id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">{getRankBadge(index + 1)}</span>
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/user/${user._id}`} className="text-sm font-medium text-gray-900 dark:text-white truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {user.name}
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.totalScore.toLocaleString()} điểm
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔥 Chủ đề nổi bật</h3>
        <div className="space-y-3">
          {trendingTopics.map((post) => (
            <button
              key={post._id}
              onClick={() => onTopicClick(post._id)}
              className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 break-all mt-1 overflow-hidden display-block">
                    {post.content}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                  {post.category.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {post.interactionScore} lượt tương tác
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📋 Quy tắc cộng đồng
        </h3>
        
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Chia sẻ kinh nghiệm học tập hữu ích</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Tôn trọng và hỗ trợ lẫn nhau</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Đặt câu hỏi rõ ràng và cụ thể</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-red-500">✗</span>
            <span>Không spam hoặc quảng cáo</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-red-500">✗</span>
            <span>Không sử dụng ngôn ngữ không phù hợp</span>
          </div>
        </div>
      </div>
    </div>
  );
} 