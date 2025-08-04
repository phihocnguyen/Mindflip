'use client';

import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
  }[];
}

export default function ProgressCharts() {
  const [weeklyData, setWeeklyData] = useState<ChartData | null>(null);
  const [monthlyData, setMonthlyData] = useState<ChartData | null>(null);
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
    // Weekly progress data
    const weeklyLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const weeklyProgress = [65, 72, 68, 85, 78, 90, 82];
    const weeklyStudyTime = [45, 60, 30, 75, 50, 90, 65];

    setWeeklyData({
      labels: weeklyLabels,
      datasets: [
        {
          label: 'Tiến độ (%)',
          data: weeklyProgress,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Thời gian học (phút)',
          data: weeklyStudyTime,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
        },
      ],
    });

    // Monthly accuracy data
    const monthlyLabels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
    const monthlyAccuracy = [75, 82, 78, 85];

    setMonthlyData({
      labels: monthlyLabels,
      datasets: [
        {
          label: 'Độ chính xác (%)',
          data: monthlyAccuracy,
          backgroundColor: 'rgba(147, 51, 234, 0.8)',
          borderColor: 'rgb(147, 51, 234)',
        },
      ],
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Biểu đồ tiến độ
      </h2>

      <div className="space-y-8">
        {/* Weekly Progress Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
            Tiến độ tuần này
          </h3>
          <div className="h-64">
            {weeklyData && (
              <Line 
                data={weeklyData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: false,
                    },
                  },
                }} 
              />
            )}
          </div>
        </div>

        {/* Monthly Accuracy Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
            Độ chính xác theo tháng
          </h3>
          <div className="h-48">
            {monthlyData && (
              <Bar 
                data={monthlyData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: false,
                    },
                  },
                }} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 