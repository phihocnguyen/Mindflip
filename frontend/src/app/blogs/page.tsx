'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';
import { useAuthStore } from '../../hooks/useAuth';
import axiosInstance from '../../libs/axios';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  readTime: number;
  category: string;
  tags: string[];
}

interface Set {
  _id: string;
  title: string;
  description: string;
  cards: any[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data for blog posts
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: '10 Essential Vocabulary Words for Travelers',
    excerpt: 'Learn the most important English words you need when traveling abroad. Master accommodation, itinerary, reservation, and more essential terms that will make your journey smoother and more enjoyable.',
    content: 'Full blog content would go here...',
    author: {
      name: 'Nguyễn Phi Học',
      avatar: ''
    },
    createdAt: '2025-08-05',
    readTime: 5,
    category: 'Travel',
    tags: ['vocabulary', 'travel', 'beginner']
  },
  {
    id: '2',
    title: 'Mastering Business English: Key Phrases for Meetings',
    excerpt: 'Essential expressions to confidently participate in business meetings. Learn how to open meetings, express agreement, handle disagreements, and close discussions professionally.',
    content: 'Full blog content would go here...',
    author: {
      name: 'Nguyễn Phi Học',
      avatar: ''
    },
    createdAt: '2025-08-05',
    readTime: 8,
    category: 'Business',
    tags: ['business', 'meetings', 'professional']
  },
  {
    id: '3',
    title: 'Idioms and Expressions: Colloquial English',
    excerpt: 'Understanding common English idioms will greatly improve your fluency. Master expressions like "break the ice", "bite the bullet", and "spill the beans" to sound more natural.',
    content: 'Full blog content would go here...',
    author: {
      name: 'Nguyễn Phi Học',
      avatar: ''
    },
    createdAt: '2025-08-05',
    readTime: 10,
    category: 'Expressions',
    tags: ['idioms', 'expressions', 'fluency']
  },
  {
    id: '4',
    title: 'Academic Writing: Formal Vocabulary and Structure',
    excerpt: 'Learn how to write formal academic papers in English with proper vocabulary and structure. Master academic phrases, formal expressions, and citation techniques.',
    content: 'Full blog content would go here...',
    author: {
      name: 'Nguyễn Phi Học',
      avatar: ''
    },
    createdAt: '2025-08-05',
    readTime: 12,
    category: 'Academic',
    tags: ['academic', 'writing', 'formal']
  },
  {
    id: '5',
    title: 'Pronunciation Guide: Common English Sounds',
    excerpt: 'Master the challenging sounds in English pronunciation. Learn the difference between similar sounds and practice with audio examples.',
    content: 'Full blog content would go here...',
    author: {
      name: 'Nguyễn Phi Học',
      avatar: ''
    },
    createdAt: '2025-08-05',
    readTime: 7,
    category: 'Pronunciation',
    tags: ['pronunciation', 'speaking', 'phonics']
  },
  {
    id: '6',
    title: 'Grammar Essentials: Present Perfect vs Past Simple',
    excerpt: 'Understand when to use present perfect and when to use past simple tense. Clear explanations with practical examples.',
    content: 'Full blog content would go here...',
    author: {
      name: 'Nguyễn Phi Học',
      avatar: ''
    },
    createdAt: '2025-08-05',
    readTime: 6,
    category: 'Grammar',
    tags: ['grammar', 'tenses', 'intermediate']
  }
];

// Category colors for consistent theming
const categoryColors = {
  Travel: 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-800 dark:text-blue-200 border-blue-200/50 dark:border-blue-700/50',
  Business: 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 border-green-200/50 dark:border-green-700/50',
  Expressions: 'from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 text-purple-800 dark:text-purple-200 border-purple-200/50 dark:border-purple-700/50',
  Academic: 'from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-800 dark:text-orange-200 border-orange-200/50 dark:border-orange-700/50',
  Pronunciation: 'from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 text-pink-800 dark:text-pink-200 border-pink-200/50 dark:border-pink-700/50',
  Grammar: 'from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 text-indigo-800 dark:text-indigo-200 border-indigo-200/50 dark:border-indigo-700/50'
};

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

export default function BlogListPage() {
  const [sets, setSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedSets = await fetchSidebarData();
        setSets(fetchedSets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/10 flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/10 relative">
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

      {/* Main Content - Enhanced responsive layout with proper spacing for right panels */}
      <div className="lg:ml-64 transition-all duration-300 ease-in-out">
        {/* Enhanced Mobile Header */}
        <div className="lg:hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleSidebar}
              className="flex items-center p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Blog
              </h1>
            </div>
            <div className="w-9"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Content Container */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Enhanced Desktop Header */}
          <div className="hidden lg:block mb-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                  English Learning Blog
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Khám phá những bài viết hấp dẫn, làm chủ từ vựng mới và nâng cao kỹ năng tiếng Anh của bạn thông qua nội dung được chọn lọc kỹ lưỡng.
              </p>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 max-w-xl  mx-auto mb-8">
              <div className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{mockBlogPosts.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Số lượng bài viết</div>
              </div>
              <div className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">6</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Số lượng danh mục</div>
              </div>
              <div className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">48</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Thời gian đọc</div>
              </div>
            </div>
          </div>

          {/* Enhanced Blog Grid */}
          <div className="space-y-8">
            {/* Featured Article */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Bài viết nổi bật
              </h2>
              
              <Link href={`/blogs/${mockBlogPosts[0].id}`} className="block group">
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="p-8 lg:p-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${categoryColors[mockBlogPosts[0].category as keyof typeof categoryColors]} border mb-4 lg:mb-0`}>
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        {mockBlogPosts[0].category}
                      </span>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">{new Date(mockBlogPosts[0].createdAt).toLocaleDateString('vi-VN')}</span>
                        <span className="mx-2">•</span>
                        <span>{mockBlogPosts[0].readTime} phút đọc</span>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {mockBlogPosts[0].title}
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed">
                      {mockBlogPosts[0].excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-xl w-10 h-10 flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{mockBlogPosts[0].author.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {mockBlogPosts[0].tags.slice(0, 3).map(tag => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Regular Articles Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                Tất cả bài viết
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockBlogPosts.slice(1).map((post, index) => (
                  <Link 
                    key={post.id} 
                    href={`/blogs/${post.id}`}
                    className="block group"
                  >
                    <div 
                      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 overflow-hidden hover:shadow-xl transition-all duration-300 h-full group-hover:scale-105"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {/* Category Badge */}
                      <div className="px-6 pt-6">
                        <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${categoryColors[post.category as keyof typeof categoryColors]} border`}>
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                          {post.category}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        {/* Author & Meta */}
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-center">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg w-8 h-8 flex items-center justify-center mr-2">
                              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300">{post.author.name}</p>
                              <div className="flex items-center text-xs">
                                <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                <span className="mx-1">•</span>
                                <span>{post.readTime} phút đọc</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map(tag => (
                            <span 
                              key={tag} 
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}