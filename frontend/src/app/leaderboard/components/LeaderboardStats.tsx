'use client';
import Link from 'next/link';

interface LeaderboardStats {
  totalUsers: number;
  activeUsers: number;
  topScore: number;
  averageScore: number;
  userRank?: number;
  userScore?: number;
}

interface Kpis {
  totalUsers: number;
  totalPosts: number;
  highestScore: number;
  averageScore: number;
}

type User = {
  _id: string;
  score: number;
  name: string;
  avatar?: string;
}

interface CurrentUser {
  rank: number;
  score: number;
  user: User;
}

interface LeaderboardStatsProps {
  kpis: Kpis | null;
  currentUser: CurrentUser | null;
  loading: boolean;
}

export default function LeaderboardStats({ kpis, currentUser, loading }: LeaderboardStatsProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="mt-6 h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!kpis || !currentUser) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu thống kê.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Thống kê bảng xếp hạng
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="text-2xl font-bold">{kpis.totalUsers.toLocaleString('vi-VN')}</div>
          <div className="text-sm opacity-90">Tổng người dùng</div>
        </div>
        <div className="text-center bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="text-2xl font-bold">{kpis.totalPosts.toLocaleString('vi-VN')}</div>
          <div className="text-sm opacity-90">Tổng số bài viết</div>
        </div>
        <div className="text-center bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
          <div className="text-2xl font-bold">{kpis.highestScore.toLocaleString('vi-VN')}</div>
          <div className="text-sm opacity-90">Điểm cao nhất</div>
        </div>
        <div className="text-center bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="text-2xl font-bold">{kpis.averageScore.toLocaleString('vi-VN')}</div>
          <div className="text-sm opacity-90">Điểm trung bình</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/user/${currentUser.user._id}`} className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity">
              {currentUser.user.avatar ? <img src={currentUser.user.avatar} alt={currentUser.user.name} className="w-12 h-12 rounded-full object-cover" /> : currentUser.user.name.charAt(0).toUpperCase()}
            </Link>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Thứ hạng của bạn</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                <span className="text-blue-600 dark:text-yellow-400">#{currentUser.rank}</span> / {kpis.totalUsers.toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Điểm của bạn</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{currentUser.score.toLocaleString('vi-VN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 