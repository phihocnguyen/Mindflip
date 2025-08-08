'use client';

import { useEffect, useState } from 'react';

interface LeaderboardFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  timeRange: string;
  search: string;
}



export default function LeaderboardFilters({ onFilterChange }: LeaderboardFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({ timeRange: 'all', search: '' });

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange(filters);
    }, 500); // Gửi request sau 500ms không gõ nữa

    return () => clearTimeout(handler);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({ timeRange: 'all', search: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Bộ lọc
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Khoảng thời gian
          </label>
          <select
            value={filters.timeRange}
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Tất cả thời gian</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>

        {/* Search Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tìm kiếm
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm theo tên..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Filter Buttons
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange('timeRange', 'week')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filters.timeRange === 'week'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Tuần này
        </button>
        <button
          onClick={() => handleFilterChange('timeRange', 'month')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filters.timeRange === 'month'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Tháng này
        </button>
        <button
          onClick={() => handleFilterChange('category', 'toeic')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filters.category === 'toeic'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          TOEIC
        </button>
        <button
          onClick={() => handleFilterChange('category', 'ielts')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filters.category === 'ielts'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          IELTS
        </button>
        <button
          onClick={() => {
            setFilters({ timeRange: 'all', category: 'all', searchTerm: '' });
            onFilterChange({ timeRange: 'all', category: 'all', searchTerm: '' });
          }}
          className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div> */}
    </div>
  );
} 