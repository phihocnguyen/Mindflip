'use client';

import { useEffect, useState } from 'react';

interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
}

interface RecentActivity {
  id: string;
  type: 'completed' | 'started' | 'mastered';
  setTitle: string;
  timestamp: string;
  description: string;
}

export default function ProgressStats() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      generateMockData();
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const generateMockData = () => {
    setStats([
      {
        label: 'Từ vựng mới hôm nay',
        value: 24,
        change: '+12%',
        changeType: 'positive',
        icon: '📚',
      },
      {
        label: 'Thời gian học trung bình',
        value: '45 phút',
        change: '+8%',
        changeType: 'positive',
        icon: '⏰',
      },
      {
        label: 'Độ chính xác trung bình',
        value: '87%',
        change: '+3%',
        changeType: 'positive',
        icon: '🎯',
      },
      {
        label: 'Chuỗi học tập',
        value: '15 ngày',
        change: '+2 ngày',
        changeType: 'positive',
        icon: '🔥',
      },
    ]);

    setRecentActivities([
      {
        id: '1',
        type: 'completed',
        setTitle: 'Từ vựng TOEIC cơ bản',
        timestamp: '2 giờ trước',
        description: 'Hoàn thành bộ từ vựng TOEIC cơ bản với 85% độ chính xác',
      },
      {
        id: '2',
        type: 'started',
        setTitle: 'Từ vựng IELTS nâng cao',
        timestamp: '1 ngày trước',
        description: 'Bắt đầu học bộ từ vựng IELTS nâng cao',
      },
      {
        id: '3',
        type: 'mastered',
        setTitle: 'Từ vựng tiếng Anh giao tiếp',
        timestamp: '2 ngày trước',
        description: 'Thuộc 100% từ vựng trong bộ giao tiếp cơ bản',
      },
      {
        id: '4',
        type: 'completed',
        setTitle: 'Từ vựng chuyên ngành IT',
        timestamp: '3 ngày trước',
        description: 'Hoàn thành bộ từ vựng chuyên ngành IT',
      },
    ]);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return '✅';
      case 'started':
        return '🚀';
      case 'mastered':
        return '🏆';
      default:
        return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'started':
        return 'text-blue-600 dark:text-blue-400';
      case 'mastered':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-6 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Thống kê chi tiết
      </h2>

      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
                {stat.change && (
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600 dark:text-green-400' 
                      : stat.changeType === 'negative'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {stat.change}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
            Hoạt động gần đây
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-lg mt-0.5">{getActivityIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                      {activity.setTitle}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 