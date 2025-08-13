'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Sidebar from '../../components/Sidebar';
import CommunityHeader from './components/CommunityHeader';
import CommunityPosts from './components/CommunityPosts';
import CommunitySidebar from './components/CommunitySidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuthStore } from '~/hooks/useAuth';
import { Post } from './types';
import { axiosInstance } from '~/libs';
import CommentModal from './components/CommentModal';

const POST_LIMIT = 5;

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuthStore();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sets] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [modalPostId, setModalPostId] = useState<string | null>(null);

  const CATEGORIES = ['TOEIC', 'IELTS', 'Giao tiếp', 'Mẹo học tập', 'Câu hỏi'];
  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'TOEIC': 'TOEIC',
      'IELTS': 'IELTS',
      'Giao tiếp': 'Giao tiếp',
      'Mẹo học tập': 'Mẹo học tập',
      'Câu hỏi': 'Câu hỏi',
    };
    return labels[category] || 'Chung';
  };

  const fetchPosts = useCallback(async (pageNum: number, isNewCategory: boolean = false) => {
    setLoadingPosts(true);
    
    let url = `/api/posts?page=${pageNum}&limit=${POST_LIMIT}`;
    if (selectedCategory) {
      url += `&category=${selectedCategory}`;
    }
    try {
      const response = await axiosInstance.get(url);
      const data = response.data.data
      if (data) {
        setPosts(prev => isNewCategory ? data.data : [...prev, ...data.data]);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  }, [selectedCategory]);

  const handlePostCreated = (newPost: Post) => {
    setPosts(currentPosts => [newPost, ...currentPosts]);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts(1, true);
    }
  }, [isAuthenticated, fetchPosts]);

  const handleLike = async (postId: string) => {
    try {
      const response = await axiosInstance.post(`/api/posts/${postId}/like`);
      const updatedPost = response.data.data
      setPosts(currentPosts => currentPosts.map(p => (p._id === postId ? updatedPost : p)));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
 
  const handleCommentPosted = (postId: string, newCommentCount: number) => {
    setPosts(currentPosts =>
      currentPosts.map(p => (p._id === postId ? { ...p, commentCount: newCommentCount } : p))
    );
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await axiosInstance.delete(`/api/posts/${postId}`);
      setPosts(currentPosts => currentPosts.filter(p => p._id !== postId));
    } catch (error) {
      console.error("Lỗi khi xóa bài đăng:", error);
    }
  };

  const handleCategoryChange = (category: string | null) => {
    setPosts([]);
    setPage(1);
    setHasMore(false);
    setSelectedCategory(category);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(currentPosts => 
      currentPosts.map(p => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          sets={sets}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <div className="lg:ml-64">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Cộng đồng</h1>
              <div className="w-10"></div> {/* Spacer */}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Desktop Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Cộng đồng
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Kết nối, chia sẻ và học hỏi cùng cộng đồng học viên
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-8">
                <Suspense fallback={<LoadingSpinner isLoading />}>
                  <CommunityHeader onPostCreated={handlePostCreated} />
                </Suspense>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleCategoryChange(null)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        selectedCategory === null
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Tất cả
                    </button>
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          selectedCategory === category
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {getCategoryLabel(category)}
                      </button>
                    ))}
                  </div>
                </div>
                          
                <Suspense fallback={<LoadingSpinner isLoading />}>
                  <CommunityPosts 
                    posts={posts} 
                    loading={loadingPosts && page === 1}
                    onLike={handleLike}
                    onCommentPosted={handleCommentPosted}
                    onDeletePost={handleDeletePost}
                  />
                  <div className="text-center h-10 flex items-center justify-center">
                    {!loadingPosts && (
                      <>
                        {hasMore ? (
                          <button 
                            onClick={handleLoadMore}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            Xem thêm
                          </button>
                        ) : (
                          posts.length > 0 && <p className="text-gray-500">Bạn đã xem hết bài đăng.</p>
                        )}
                      </>
                    )}
                  </div>
                </Suspense>
              </div>


              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Suspense fallback={<LoadingSpinner isLoading />}>
                  <CommunitySidebar onTopicClick={setModalPostId} />
                </Suspense>
              </div>
            </div>
            {modalPostId && (
              <CommentModal 
                postId={modalPostId} 
                onClose={() => setModalPostId(null)} 
                onCommentPosted={handleCommentPosted}
                onPostUpdate={handlePostUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}