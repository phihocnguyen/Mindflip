'use client';

import { useCallback, useEffect, useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import LeaderboardTable from './components/LeaderboardTable';
import LeaderboardStats from './components/LeaderboardStats';
import LeaderboardFilters from './components/LeaderboardFilters';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuthStore } from '~/hooks/useAuth';
import { axiosInstance } from '~/libs';

interface Kpis {
  totalUsers: number;
  totalPosts: number;
  highestScore: number;
  averageScore: number;
}
interface CurrentUser {
  rank: number;
  score: number;
  user: { _id: string; score: number; name: string; avatar?: string; };
}
interface LeaderboardEntry {
  _id: string;
  name: string;
  avatar?: string;
  score: number;
  level?: string;
  lastActive: string;
}
interface FilterOptions {
  timeRange: string;
  search: string;
  level: string;
}

export default function LeaderboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sets] = useState([]); // Mock data
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const { isAuthenticated } = useAuthStore();

  // Initialize filters from URL parameters
  const getInitialFilters = () => {
    return {
      timeRange: searchParams.get('timeRange') || 'all',
      search: searchParams.get('search') || '',
      level: searchParams.get('level') || 'all'
    };
  };

  const [filters, setFilters] = useState<FilterOptions>(getInitialFilters());

  const fetchLeaderboard = useCallback(async (pageNum: number, currentFilters: FilterOptions, isNewFilter: boolean = false) => {
    if (pageNum === 1) setLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: '10',
        timeRange: currentFilters.timeRange,
        search: currentFilters.search,
      });

      if (currentFilters.level && currentFilters.level !== 'all') {
        params.append('level', currentFilters.level);
      }

      const response = await axiosInstance.get(`/api/leaderboard?${params.toString()}`);
      const data = response.data.data
      if (isNewFilter) {
        setKpis(data.kpis);
        setCurrentUser(data.currentUser);
        setLeaderboard(data.leaderboard.data);
        setTotalPages(data.leaderboard.totalPages);
      } else {
        setLeaderboard(prev => [...prev, ...data.leaderboard.data]);
      }
      setHasMore(data.leaderboard.hasMore);

    } catch (error) {
      console.error("Lỗi khi tải bảng xếp hạng:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Get page from URL or default to 1
      const pageParam = searchParams.get('page');
      const page = pageParam ? parseInt(pageParam, 10) : 1;
      setPage(page);
      
      // Get filters from URL
      const urlFilters = getInitialFilters();
      setFilters(urlFilters);
      
      fetchLeaderboard(page, urlFilters, true);
    }
  }, [isAuthenticated, searchParams, fetchLeaderboard]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setPage(1);
    setFilters(newFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    if (newFilters.timeRange && newFilters.timeRange !== 'all') {
      params.set('timeRange', newFilters.timeRange);
    }
    if (newFilters.search) {
      params.set('search', newFilters.search);
    }
    if (newFilters.level && newFilters.level !== 'all') {
      params.set('level', newFilters.level);
    }
    params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      
      // Update URL with new page
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
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

        {/* Main Content - Adjusted for fixed sidebar */}
        <div className="lg:ml-64">
          {/* Mobile Header with Menu Button */}
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
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Bảng xếp hạng</h1>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Desktop Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Bảng xếp hạng
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Xem thứ hạng và thành tích của các học viên
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <Suspense fallback={<LoadingSpinner isLoading />}>
                <LeaderboardStats kpis={kpis} currentUser={currentUser} loading={loading} />
              </Suspense>
              
              <Suspense fallback={<LoadingSpinner isLoading />}>
                <LeaderboardFilters onFilterChange={handleFilterChange} />
              </Suspense>
              
              <Suspense fallback={<LoadingSpinner isLoading />}>
                <LeaderboardTable 
                  leaderboardData={leaderboard} 
                  loading={loading}
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 