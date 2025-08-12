'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../hooks/authStore';
import StatsCards from './components/StatsCards';
import ChartsSection from './components/ChartsSection';
import CalendarHeatmap from './components/CalendarHeatmap';
import RecentSets from './components/RecentSets';
import QuickActions from './components/QuickActions';
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

interface DashboardClientProps {
  initialData: DashboardData;
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    const fetchDashboardData = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/dashboard/overview');
        setDashboardData(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    // Only fetch data if authenticated and we don't have initial data
    if (isAuthenticated && !initialData) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isLoading, router, token, initialData]);

  // Show loading state while checking auth or fetching data
  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  if (error) {
    return (
      <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-700 dark:text-yellow-300">Không có dữ liệu để hiển thị.</p>
      </div>
    );
  }

  // Process data for charts
  const kpis = dashboardData.kpis || {};
  const skillDistribution = dashboardData.skillDistribution || [];
  const termStatusDistribution = dashboardData.termStatusDistribution || [];
  const cardsPerSet = dashboardData.cardsPerSet || [];
  const recentSetsData = dashboardData.recentSets || [];
  
  // Mock data cho charts (fallback)
  const pieData = {
    labels: ['Công khai', 'Riêng tư'],
    datasets: [{
      data: [kpis.publicSets || 0, kpis.privateSets || 0],
      backgroundColor: ['#4F46E5', '#F59E0B'],
      borderColor: ['#ffffff', '#ffffff'],
      borderWidth: 1,
    }],
  };
  
  const barData = {
    labels: cardsPerSet.map((set: any) => set.name.length > 15 ? set.name.slice(0, 15) + '...' : set.name),
    datasets: [{
      label: 'Số thẻ',
      data: cardsPerSet.map((set: any) => set['Số thẻ']),
      backgroundColor: '#4F46E5',
      borderColor: '#4F46E5',
      borderWidth: 1,
    }],
  };
  
  // New chart for skill distribution
  const skillDistributionData = {
    labels: skillDistribution.map((skill: any) => skill.name),
    datasets: [{
      label: 'Số lần luyện tập',
      data: skillDistribution.map((skill: any) => skill.value),
      backgroundColor: [
        '#4F46E5',
        '#10B981',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6',
        '#3B82F6'
      ],
      borderColor: [
        '#ffffff',
        '#ffffff',
        '#ffffff',
        '#ffffff',
        '#ffffff',
        '#ffffff'
      ],
      borderWidth: 1,
    }],
  };
  
  // Chart for most reviewed cards (using cardsPerSet data)
  const mostReviewedCardsData = {
    labels: cardsPerSet.slice(0, 5).map((set: any) => 
      set.name.length > 20 ? set.name.slice(0, 20) + '...' : set.name
    ),
    datasets: [{
      label: 'Số thẻ',
      data: cardsPerSet.slice(0, 5).map((set: any) => set['Số thẻ']),
      backgroundColor: '#4F46E5',
      borderColor: '#4F46E5',
      borderWidth: 1,
    }],
  };
  
  const doughnutData = {
    labels: termStatusDistribution.map((status: any) => status.name),
    datasets: [{
      data: termStatusDistribution.map((status: any) => status.value),
      backgroundColor: ['#10B981', '#3B82F6', '#EF4444', '#F59E0B'],
      borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
      borderWidth: 1,
    }],
  };
  
  // Stats cards data
  const masteredCards = termStatusDistribution.find((status: any) => status.name === 'Đã thuộc')?.value || 0;
  const learningCards = termStatusDistribution.find((status: any) => status.name === 'Đang học')?.value || 0;

  return (
    <>
      {/* Stats Cards */}
      <StatsCards 
        setsCount={kpis.totalSets || 0}
        totalCards={kpis.totalTerms || 0}
        publicSets={kpis.publicSets || 0}
        privateSets={kpis.privateSets || 0}
        masteredCards={masteredCards}
        learningCards={learningCards}
      />

      {/* Charts Section */}
      <ChartsSection 
        pieData={pieData}
        barData={barData}
        skillDistributionData={skillDistributionData}
        mostReviewedCardsData={mostReviewedCardsData}
        doughnutData={doughnutData}
      />

      {/* Calendar Heatmap */}
      <CalendarHeatmap initialData={dashboardData?.heatmapData} />

      {/* Recent Sets and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentSets recentSets={recentSetsData} />
        <QuickActions />
      </div>
    </>
  );
}