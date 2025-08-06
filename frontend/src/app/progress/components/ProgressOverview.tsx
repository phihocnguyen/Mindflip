'use client';

interface ProgressKpis {
  completedSets: number;
  totalSets: number;
  learnedTerms: number;
  totalTerms: number;
  currentStreak: number;
  totalStudyTimeSeconds: number;
  overallAccuracy: number;
}

export default function ProgressOverview({ kpis }: { kpis: ProgressKpis }) {
  if (!kpis) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Không có dữ liệu tiến độ
        </p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
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
            <div className="text-2xl font-bold">{kpis.completedSets}</div>
            <div className="text-sm opacity-90">Bộ từ hoàn thành</div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {kpis.totalSets} bộ từ tổng cộng
          </div>
        </div>
        {/* Từ vựng đã thuộc */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{kpis.learnedTerms}</div>
            <div className="text-sm opacity-90">Từ đã thuộc</div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {kpis.totalTerms} từ tổng cộng
          </div>
        </div>
        {/* Chuỗi học tập */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{kpis.currentStreak}</div>
            <div className="text-sm opacity-90">Chuỗi ngày học</div>
          </div>
        </div>
        {/* Tổng thời gian học */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{formatTime(kpis.totalStudyTimeSeconds)}</div>
            <div className="text-sm opacity-90">Tổng thời gian học</div>
          </div>
        </div>
      </div>
      {/* Độ chính xác tổng thể */}
      <div className="mt-6 text-center w-full mx-auto">
        <div className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          Độ chính xác tổng thể:
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.round(kpis.overallAccuracy * 100)}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {Math.round(kpis.overallAccuracy * 100)}%
        </div>
      </div>
    </div>
  );
} 