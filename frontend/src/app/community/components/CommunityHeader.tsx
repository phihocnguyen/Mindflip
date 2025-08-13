'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../hooks/authStore';
import { axiosInstance } from '~/libs';
import LoadingSpinner from '~/components/LoadingSpinner';
import { Post } from '../types';

interface CommunityStats {
  members: number;
  posts: number;
  interactions: number;
}

interface CommunityHeaderProps {
  onPostCreated: (newPost: Post) => void;
}

const CATEGORIES = [
  'TOEIC',
  'IELTS',
  'Giao tiếp',
  'Mẹo học tập',
  'Câu hỏi'
];

export default function CommunityHeader({ onPostCreated }: CommunityHeaderProps) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState(CATEGORIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await axiosInstance.get('/api/community/stats');
        setStats(response.data.data);
      } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
        setStats({ members: 0, posts: 0, interactions: 0 });
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const handleCreatePost = async () => {
    if (!postTitle.trim() || !postContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post('/api/posts', {
        title: postTitle,
        content: postContent,
        category: postCategory,
      });
      let newPost = {}
      if (res.status === 201) {
        newPost = res.data.data;
        setPostTitle('');
        setPostContent('');
        setPostCategory(CATEGORIES[0]);
        setShowCreatePost(false);
        onPostCreated(newPost as Post); 
      }

    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Chia sẻ với cộng đồng
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Chia sẻ kinh nghiệm học tập, đặt câu hỏi hoặc thảo luận
          </p>
        </div>
        
        <button
          onClick={() => setShowCreatePost(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo bài viết
          </span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* << 4. Hiển thị dữ liệu từ state, có xử lý loading >> */}
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {loadingStats ? '...' : stats?.members.toLocaleString('vi-VN')}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Thành viên</div>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {loadingStats ? '...' : stats?.posts.toLocaleString('vi-VN')}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Bài viết</div>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {loadingStats ? '...' : stats?.interactions.toLocaleString('vi-VN')}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tương tác</div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
            <LoadingSpinner isLoading={isSubmitting} />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tạo bài viết mới
              </h3>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Danh mục
                </label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="TOEIC">TOEIC</option>
                  <option value="IELTS">IELTS</option>
                  <option value="Giao tiếp">Giao tiếp</option>
                  <option value="Mẹo học tập">Mẹo học tập</option>
                  <option value="Câu hỏi">Câu hỏi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nội dung
                </label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Chia sẻ kinh nghiệm, đặt câu hỏi hoặc thảo luận..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!postTitle.trim() || !postContent.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Đăng bài
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 