'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../hooks/authStore';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import SetsGrid from './components/SetsGrid';
import Link from 'next/link';
import { apiHelper } from '../../libs/api';

interface Card {
  term: string;
  definition: string;
}

interface Set {
  _id: string;
  title: string;
  description: string;
  cards: Card[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SetsPage() {
  const [sets, setSets] = useState<Set[]>([]);
  const [filteredSets, setFilteredSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  // Initialize filteredSets when sets change
  useEffect(() => {
    setFilteredSets(sets);
  }, [sets]);

  useEffect(() => {
    console.log('SetsPage useEffect - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
    
    if (isLoading) {
      console.log('Still loading, waiting...');
      return;
    }

    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    console.log('Authenticated, fetching sets...');
    fetchSets();
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    filterSets();
  }, [sets, searchTerm, selectedFilter]);

  const filterSets = () => {
    // Ensure sets is always an array
    let filtered = Array.isArray(sets) ? [...sets] : [];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(set =>
        set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        set.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected filter
    switch (selectedFilter) {
      case 'recent':
        filtered = filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'alphabetical':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'public':
        filtered = filtered.filter(set => set.isPublic);
        break;
      case 'private':
        filtered = filtered.filter(set => !set.isPublic);
        break;
      default:
        break;
    }

    setFilteredSets(filtered);
  };

  const fetchSets = async () => {
    try {
      const response = await apiHelper.get('/api/sets');
      if (response.success) {
        setSets(response.data as Set[]);
      } else {
        throw new Error(response.error || 'Failed to fetch sets');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (setId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bộ từ này?')) {
      return;
    }

    try {
      const response = await apiHelper.delete(`/api/sets/${setId}`);
      
      if (response.success) {
        setSets(sets.filter(set => set._id !== setId));
      } else {
        throw new Error(response.error || 'Failed to delete set');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete set');
    }
  };

  // Show loading spinner when auth is loading or user is not authenticated
  const showLoading = isLoading || !isAuthenticated || loading;

  return (
    <>
      <LoadingSpinner isLoading={showLoading} />
      
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
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Bộ từ vựng</h1>
              <div className="w-10"></div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Bộ từ vựng của tôi
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Quản lý và học các bộ từ vựng của bạn
                  </p>
                </div>
                <Link
                  href="/sets/create"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tạo bộ từ mới
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Filter Section */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 lg:mb-0">
                    Bộ lọc
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === 'all'
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Tất cả ({sets.length})
                  </button>
                  <button
                    onClick={() => setSelectedFilter('recent')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === 'recent'
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Gần đây
                  </button>
                  <button
                    onClick={() => setSelectedFilter('alphabetical')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === 'alphabetical'
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Theo bảng chữ cái
                  </button>
                  <button
                    onClick={() => setSelectedFilter('public')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === 'public'
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Công khai
                  </button>
                  <button
                    onClick={() => setSelectedFilter('private')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === 'private'
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Riêng tư
                  </button>
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredSets.length} bộ từ
                {searchTerm && ` cho "${searchTerm}"`}
              </div>
              {selectedFilter !== 'all' && (
                <button
                  onClick={() => setSelectedFilter('all')}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            {/* Sets Grid */}
            <SetsGrid
              filteredSets={filteredSets}
              searchTerm={searchTerm}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </>
  );
} 