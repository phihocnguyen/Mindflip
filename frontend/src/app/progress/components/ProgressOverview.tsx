'use client';

import { useEffect, useState } from 'react';

interface ProgressData {
  totalSets: number;
  completedSets: number;
  totalCards: number;
  masteredCards: number;
  currentStreak: number;
  totalStudyTime: number;
  accuracy: number;
}

export default function ProgressOverview() {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      // Mock data for development
      setProgressData({
        totalSets: 12,
        completedSets: 8,
        totalCards: 240,
        masteredCards: 180,
        currentStreak: 15,
        totalStudyTime: 360,
        accuracy: 85,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Không có dữ liệu tiến độ
        </p>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Tổng quan tiến độ
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Bộ từ đã hoàn thành */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{progressData.completedSets}</div>
            <div className="text-sm opacity-90">Bộ từ hoàn thành</div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {progressData.totalSets} bộ từ tổng cộng
          </div>
        </div>

        {/* Từ vựng đã thuộc */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{progressData.masteredCards}</div>
            <div className="text-sm opacity-90">Từ đã thuộc</div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {progressData.totalCards} từ tổng cộng
          </div>
        </div>

        {/* Chuỗi học tập */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{progressData.currentStreak}</div>
            <div className="text-sm opacity-90">Ngày liên tiếp</div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Chuỗi học tập hiện tại
          </div>
        </div>

        {/* Thời gian học */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{formatTime(progressData.totalStudyTime)}</div>
            <div className="text-sm opacity-90">Thời gian học</div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Tổng thời gian
          </div>
        </div>
      </div>

      {/* Accuracy Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Độ chính xác
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {progressData.accuracy}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressData.accuracy}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
} 