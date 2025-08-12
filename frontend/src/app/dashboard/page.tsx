import { redirect } from 'next/navigation';
import SidebarWrapper from './SidebarWrapper';
import DashboardClient from './DashboardClient';
import axiosInstance from '../../libs/axios';

// Data interfaces
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

interface DashboardData {
  kpis: {
    totalSets: number;
    totalTerms: number;
    publicSets: number;
    privateSets: number;
    studyTimeSeconds: number;
  };
  skillDistribution: Array<{ name: string; value: number }>;
  termStatusDistribution: Array<{ name: string; value: number }>;
  cardsPerSet: Array<{ name: string; 'Số thẻ': number }>;
  heatmapData: Array<{ date: string; count: number }>;
  recentSets: Array<{ _id: string; title: string }>;
}

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

// Fetch dashboard overview data
async function fetchDashboardData(): Promise<DashboardData | null> {
  try {
    const response = await axiosInstance.get('/api/dashboard/overview');
    return response.data.data;
  } catch (error: any) {
    // Handle 401 errors specifically
    if (error.response?.status === 401) {
      // We'll handle redirect in the component
      console.log('Unauthorized access - token may be invalid');
      return null;
    }
    console.error('Error fetching dashboard data:', error);
    return null;
  }
}

export default async function DashboardPage() {
  const [sets, dashboardData] = await Promise.all([
    fetchSidebarData(),
    fetchDashboardData()
  ]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarWrapper initialSets={sets} />

      {/* Main Content - Adjusted for fixed sidebar */}
      <div className="lg:ml-64">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Tổng quan về hoạt động học tập của bạn
            </p>
          </div>

          <DashboardClient initialData={dashboardData as DashboardData} />
        </div>
      </div>
    </div>
  );
}