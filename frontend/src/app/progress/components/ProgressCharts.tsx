'use client';

import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

interface WeeklyChart {
  labels: string[];
  accuracy: number[];
  studyTime: number[];
}
interface MonthlyChart {
  labels: string[];
  accuracy: number[];
}

export default function ProgressCharts({ weeklyChart, monthlyChart }: { weeklyChart: WeeklyChart, monthlyChart: MonthlyChart }) {
  if (!weeklyChart || !monthlyChart) {
    return <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center text-gray-500 dark:text-gray-400">Không có dữ liệu biểu đồ</div>;
  }

  const weeklyData = {
    labels: weeklyChart.labels,
    datasets: [
      {
        label: 'Độ chính xác (%)',
        data: weeklyChart.accuracy,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Thời gian học (phút)',
        data: weeklyChart.studyTime,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const monthlyData = {
    labels: monthlyChart.labels,
    datasets: [
      {
        label: 'Độ chính xác (%)',
        data: monthlyChart.accuracy,
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgb(147, 51, 234)',
      },
    ],
  };

  const weeklyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: 'rgb(156, 163, 175)' },
      },
      title: {
        display: true,
        text: 'Tiến độ tuần này',
        color: 'rgb(55, 65, 81)',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        position: 'left' as const,
        title: { display: true, text: 'Độ chính xác (%)' },
        min: 0,
        max: 100,
        ticks: { color: 'rgb(156, 163, 175)' },
      },
      y1: {
        type: 'linear' as const,
        position: 'right' as const,
        title: { display: true, text: 'Thời gian học (phút)' },
        min: 0,
        max: Math.max(...weeklyChart.studyTime, 100),
        grid: { drawOnChartArea: false },
        ticks: { color: 'rgb(16, 185, 129)' },
      },
    },
  };

  const monthlyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: 'rgb(156, 163, 175)' },
      },
      title: {
        display: true,
        text: 'Độ chính xác theo tháng',
        color: 'rgb(55, 65, 81)',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { color: 'rgb(156, 163, 175)' },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-8" style={{ height: 300 }}>
        <Line data={weeklyData} options={weeklyOptions} />
      </div>
      <div style={{ height: 220 }}>
        <Bar data={monthlyData} options={monthlyOptions} />
      </div>
    </div>
  );
} 