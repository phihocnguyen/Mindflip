'use client';

import { BookOpen, Clock, Percent, Flame, TrendingUp, Award, Target, Calendar } from 'lucide-react';

interface ProgressKpis {
  completedSets: number;
  totalSets: number;
  learnedTerms: number;
  totalTerms: number;
  currentStreak: number;
  totalStudyTimeSeconds: number;
  overallAccuracy: number;
}

interface DetailedStats {
  newTermsToday: number;
  newTermsChange: number; // 0.12 = +12%
  averageAccuracy: number; // 0.87 = 87%
  averageAccuracyChange: number; // 0.03 = +3%
  longestStreak: number;
  longestStreakChange: number; // 2 = +2 ngày
}

interface RecentActivity {
  id: string;
  type: 'completed' | 'started' | 'mastered';
  setTitle: string;
  timestamp: string;
  description: string;
}

export default function ProgressStats({ kpis, detailedStats, recentActivities }: { kpis: ProgressKpis, detailedStats: DetailedStats, recentActivities?: RecentActivity[] }) {
  if (!kpis || !detailedStats) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Không có dữ liệu thống kê
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Helper format
  const percent = (val?: number) => val !== undefined ? (val > 0 ? `+${Math.round(val * 100)}%` : `${Math.round(val * 100)}%`) : '';

  const statsData = [
    {
      icon: BookOpen,
      value: detailedStats.newTermsToday,
      label: 'Từ vựng mới hôm nay',
      change: percent(detailedStats.newTermsChange),
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20'
    },
    {
      icon: Clock,
      value: `${Math.floor(kpis.totalStudyTimeSeconds / 60)}`,
      unit: 'phút',
      label: 'Thời gian học trung bình',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
    },
    {
      icon: Target,
      value: Math.round(detailedStats.averageAccuracy * 100),
      unit: '%',
      label: 'Độ chính xác trung bình',
      change: percent(detailedStats.averageAccuracyChange),
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
    },
    {
      icon: Flame,
      value: detailedStats.longestStreak,
      unit: 'ngày',
      label: 'Chuỗi học tập dài nhất',
      change: detailedStats.longestStreakChange > 0 ? `+${detailedStats.longestStreakChange} ngày` : '',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed': return BookOpen;
      case 'started': return Clock;
      case 'mastered': return Award;
      default: return BookOpen;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'completed': return 'text-emerald-500';
      case 'started': return 'text-blue-500';
      case 'mastered': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Thống kê chi tiết
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.change && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {stat.change}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      {stat.unit}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {stat.label}
                </p>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-tr from-white/5 to-white/10 rounded-full blur-lg"></div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Hoạt động gần đây
          </h3>
        </div>

        <div className="space-y-3">
          {recentActivities && recentActivities.length > 0 ? recentActivities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div 
                key={activity.id}
                className="group relative overflow-hidden bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${
                    activity.type === 'completed' ? 'from-emerald-500 to-teal-600' :
                    activity.type === 'started' ? 'from-blue-500 to-indigo-600' :
                    'from-yellow-500 to-orange-600'
                  } rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold truncate ${getActivityColor(activity.type)} group-hover:text-opacity-80 transition-colors`}>
                      {activity.setTitle}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {activity.description}
                    </p>
                  </div>
                  
                  <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {activity.timestamp}
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
            );
          }) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Chưa có hoạt động gần đây
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}