'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

interface ChartsSectionProps {
  pieData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
  barData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  // New chart for skill distribution
  skillDistributionData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
  // New chart for most reviewed cards
  mostReviewedCardsData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  doughnutData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
}

export default function ChartsSection({ pieData, barData, skillDistributionData, mostReviewedCardsData, doughnutData }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Pie Chart - Set Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Phân bố Bộ từ</h2>
        <div className="h-64">
          <Pie
            data={pieData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Công khai vs Riêng tư' },
              },
            }}
          />
        </div>
      </div>

      {/* Bar Chart - Cards per Set */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Số thẻ trong mỗi Bộ từ</h2>
        <div className="h-64">
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Số lượng thẻ' },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>

      {/* Doughnut Chart - Skill Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Sự phân bố của các kỹ năng</h2>
        <div className="h-64">
          <Doughnut
            data={skillDistributionData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'right' },
                title: { display: true, text: 'Phân bố theo loại bài tập' },
              },
            }}
          />
        </div>
      </div>

      {/* Bar Chart - Most Reviewed Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Số thẻ được ôn tập nhiều nhất</h2>
        <div className="h-64">
          <Bar
            data={mostReviewedCardsData}
            options={{
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: true, text: 'Số lần ôn tập' },
              },
              scales: {
                x: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>

      {/* Doughnut Chart - Card Status */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Trạng thái thẻ từ vựng</h2>
        <div className="h-64 flex items-center justify-center">
          <div className="w-1/2 h-full">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' },
                  title: { display: true, text: 'Phân bố trạng thái học' },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}