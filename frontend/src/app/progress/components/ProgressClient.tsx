import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import ProgressOverview from './ProgressOverview';
import ProgressCharts from './ProgressCharts';
import ProgressStats from './ProgressStats';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { apiHelper } from '~/libs';

interface ProgressKpis {
  completedSets: number;
  totalSets: number;
  learnedTerms: number;
  totalTerms: number;
  currentStreak: number;
  totalStudyTimeSeconds: number;
  overallAccuracy: number;
}
interface WeeklyChart {
  labels: string[];
  accuracy: number[];
  studyTime: number[];
}
interface MonthlyChart {
  labels: string[];
  accuracy: number[];
}
interface DashboardData {
  kpis: ProgressKpis;
  weeklyChart: WeeklyChart;
  monthlyChart: MonthlyChart;
  detailedStats: any; // Added for ProgressStats
}

interface recentLog {
  _id: string;
  activityType: string;
  durationSeconds: number;
  correctAnswer: number; 
  totalItems: number;
  createdAt: string;
  setId: {
    _id: string;
    title: string
  }
}

export default function ProgressClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sets] = useState([]); // Mock data
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [recentLogs, setRecentLogs] = useState<recentLog[]>([]);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const res : any = await apiHelper.get('/api/analytics/dashboard');
        const recentLogRes : any = await apiHelper.get('/api/logs/recent');
        setRecentLogs(recentLogRes.data);
        setDashboard(res.data)
      } catch (e) {
        setDashboard(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

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
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Tiến độ học</h1>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Desktop Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Tiến độ học
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Theo dõi quá trình học tập và cải thiện của bạn
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8">
              {loading ? (
                <LoadingSpinner isLoading />
              ) : dashboard ? (
                <>
                  <ProgressOverview kpis={dashboard.kpis} />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ProgressCharts weeklyChart={dashboard.weeklyChart} monthlyChart={dashboard.monthlyChart} />
                    <ProgressStats kpis={dashboard.kpis} detailedStats={dashboard.detailedStats} recentLogs={recentLogs} />
                  </div>
                </>
              ) : (
                <div className="text-center text-red-500">Không thể tải dữ liệu tiến độ.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}