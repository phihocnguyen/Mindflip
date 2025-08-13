'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import axiosInstance from '../../../libs/axios';
import Sidebar from '../../../components/Sidebar';
import { useAuthStore } from '../../../hooks/useAuth';
import CommentModal from '~/app/community/components/CommentModal';

// Data interfaces
interface Card {
  term: string;
  definition: string;
}

interface Author {
  _id: string;
  name: string;
  avatar?: string;
}

interface Set {
  _id?: string;
  title?: string;
  description?: string;
  cards?: Card[];
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  creatorId?: Author;
}

interface BlogPost {
  _id?: string;
  title?: string;
  content?: string;
  author?: Author;
  createdAt?: string;
  updatedAt?: string;
  likes?: string[]; // Array of user IDs who liked the post
  commentCount?: number;
}

interface User {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  createdAt?: string;
  score?: number;
  longestStreakRecord?: number;
}

interface UserStats {
  totalSets: number;
  totalPosts: number;
  totalComments: number;
  totalLikesReceived: number;
  joinDate: string;
  longestStreak: number;
  totalScore: number;
}

interface UserData {
  user: User;
  publicSets: Set[];
  blogPosts: BlogPost[];
  stats?: UserStats;
}

interface UserDetailClientProps {
  userId: string;
}

// Fetch sidebar data (user's study sets)
async function fetchSidebarData(): Promise<Set[]> {
  try {
    const response = await axiosInstance.get('/api/sets');
    return response.data.data || [];
  } catch (error: any) {
    // Handle 401 errors specifically
    if (error.response?.status === 401) {
      // We'll handle redirect in the component
      console.log('Unauthorized access - token may be invalid');
      return [];
    }
    console.error('Error fetching sidebar data:', error);
    return [];
  }
}

export default function UserDetailClient({ userId }: UserDetailClientProps) {
  console.log('Received userId:', userId);
  console.log('Type of userId:', typeof userId);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sets' | 'posts'>('sets');
  const [sets, setSets] = useState<Set[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [modalPostId, setModalPostId] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    console.log('useEffect triggered with userId:', userId);
    const fetchUserData = async () => {
      try {
        if (!userId) {
          console.log('No userId provided');
          setError('Không có ID người dùng');
          setLoading(false);
          return;
        }
        
        // Kiểm tra kiểu dữ liệu của userId
        console.log('Type of userId:', typeof userId);
        console.log('userId value:', userId);
        
        // Nếu userId là object, thử chuyển đổi
        let userIdString = userId;
        if (typeof userId === 'object') {
          userIdString = JSON.stringify(userId);
          console.log('Converted userId to string:', userIdString);
        }
        
        setLoading(true);
        console.log('Fetching user data for ID:', userIdString);
        const response = await axiosInstance.get(`/api/users/${userIdString}`);
        console.log('API response:', response.data);
        
        if (response.data.statusCode === 200) {
          console.log('User data exists:', response.data.data.user);
          setUserData(response.data.data.data);
        } else {
          console.log('Invalid data structure');
          setError('Dữ liệu không hợp lệ');
        }
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        console.error('Error response:', err.response);
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Fetch sidebar data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedSets = await fetchSidebarData();
        setSets(fetchedSets);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(parseISO(dateString), { 
        addSuffix: true,
        locale: vi 
      });
    } catch (e) {
      return 'Không xác định';
    }
  };

  // Truncate text function
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <div className="animate-pulse flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="text-center py-8">
                <p className="text-red-500 dark:text-red-400">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('userData:', userData);
  if (!userData) {
    console.log('User data is null or user is missing');
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Không tìm thấy thông tin người dùng.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { user, publicSets = [], blogPosts = [] } = userData;

  // Navigation items for sidebar
  const navItems = [
    { id: 'sets', label: 'Bộ từ vựng', count: publicSets?.length || 0, icon: (
      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { id: 'posts', label: 'Bài viết cộng đồng', count: blogPosts?.length || 0, icon: (
      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )}
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
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
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Thông tin người dùng</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* User Profile Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-8">
                <div className="flex flex-col items-center mb-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden mb-4">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name || 'User avatar'}
                        width={96}
                        height={96}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-3xl font-medium">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {user?.name || 'Người dùng'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {user?.email}
                  </p>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Điểm</p>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">
                      {user?.score || 0}
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Chuỗi</p>
                    <p className="font-bold text-green-600 dark:text-green-400">
                      {user?.longestStreakRecord || 0}
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bộ từ</p>
                    <p className="font-bold text-purple-600 dark:text-purple-400">
                      {publicSets?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bài viết</p>
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      {blogPosts?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center col-span-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Thành viên từ</p>
                    <p className="font-bold text-yellow-600 dark:text-yellow-400">
                      {user?.createdAt ? formatDate(user.createdAt) : 'Không xác định'}
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center col-span-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tổng lượt thích</p>
                    <p className="font-bold text-red-600 dark:text-red-400">
                      {blogPosts?.reduce((total, post) => total + (post.likes?.length || 0), 0) || 0}
                    </p>
                  </div>
                </div>
                
                {/* Navigation Menu */}
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as 'sets' | 'posts')}
                      className={`w-full text-left flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                      <span className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Content based on active tab */}
              {activeTab === 'sets' ? (
                <div>
                  {publicSets?.length === 0 || !publicSets ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        Người dùng này chưa có bộ từ vựng công khai nào.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {publicSets.map((set) => (
                        <div 
                          key={set?._id || Math.random()}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                                {set?.title || 'Không có tiêu đề'}
                              </h3>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                Công khai
                              </span>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                              {set?.description || 'Không có mô tả'}
                            </p>
                            
                            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                              <span>{set?.cards?.length || 0} thẻ</span>
                              <span>{set?.createdAt ? formatDate(set.createdAt) : 'Không xác định'}</span>
                            </div>
                            
                            <Link 
                              href={`/sets/${set?._id || '#'}`}
                              className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${set?._id ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                              {set?._id ? 'Học ngay' : 'Không khả dụng'}
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {blogPosts?.length === 0 || !blogPosts ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        Người dùng này chưa có bài viết cộng đồng nào.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {blogPosts.map((post) => (
                        <div 
                          key={post?._id || Math.random()}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="p-6">
                            <Link href={`/community/${post?._id || '#'}`}>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2">
                                {post?.title || truncateText(post?.content || '', 100)}
                              </h3>
                            </Link>
                            
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                              {truncateText(post?.content || '', 300)}
                            </p>
                            
                            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center space-x-4">
                                <span>{post?.createdAt ? formatDate(post.createdAt) : 'Không xác định'}</span>
                                <span>{post?.likes?.length || 0} lượt thích</span>
                                <span>{post?.commentCount || 0} bình luận</span>
                              </div>
                              
                              <button 
                                onClick={() => post?._id && setModalPostId(post._id)}
                                className={`text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium ${post?._id ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                              >
                                Đọc tiếp
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {modalPostId && (
        <CommentModal 
          postId={modalPostId} 
          onClose={() => setModalPostId(null)} 
          onCommentPosted={(postId, newCommentCount) => {
            // Cập nhật số lượng comment trong danh sách bài viết
            setUserData(prev => {
              if (!prev) return prev;
              const updatedBlogPosts = prev.blogPosts.map(post => 
                post._id === postId ? {...post, commentCount: newCommentCount} : post
              );
              return {...prev, blogPosts: updatedBlogPosts};
            });
          }} 
          onPostUpdate={(updatedPost) => {
            setUserData((prev : any) => {
              if (!prev) return prev;
              const updatedBlogPosts = prev.blogPosts.map((post : BlogPost) => 
                post._id === updatedPost._id ? updatedPost : post
              );
              return {...prev, blogPosts: updatedBlogPosts};
            });
          }} 
        />
      )}
    </div>
  );
}