'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '../../../libs/axios';

interface CalendarHeatmapProps {
  initialData?: any[];
}

export default function CalendarHeatmap({ initialData }: CalendarHeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<any[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  
  // Get color based on activity level
  const getLevelColor = (count: number) => {
    // Determine level based on count
    let level = 0;
    if (count > 0) level = 1;
    if (count >= 5) level = 2;
    if (count >= 15) level = 3;
    if (count >= 25) level = 4;
    
    const colors = [
      'bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700', // Level 0 - No activity
      'bg-green-300 dark:bg-green-900/40 border border-green-300 dark:border-green-700', // Level 1 - Low activity
      'bg-green-400 dark:bg-green-800/60 border border-green-400 dark:border-green-600', // Level 2 - Medium activity
      'bg-green-500 dark:bg-green-700/80 border border-green-500 dark:border-green-500', // Level 3 - High activity
      'bg-green-600 dark:bg-green-600 border border-green-600 dark:border-green-400' // Level 4 - Very high activity
    ];
    return colors[level] || colors[0];
  };

  // Group data by weeks starting from Monday
  const groupDataByWeeks = (apiData: any[]) => {
    // Create a map for quick lookup
    const dataMap = new Map();
    apiData.forEach(item => {
      dataMap.set(item.date, item.count);
    });
    
    const weeks = [];
    const today = new Date();
    const year = today.getFullYear();
    
    // Start from the first Monday of the year
    let currentDate = new Date(year, 0, 1);
    // Adjust to the first Monday
    const dayOfWeek = currentDate.getDay();
    currentDate.setDate(currentDate.getDate() - (dayOfWeek === 1 ? 0 : (dayOfWeek === 0 ? -1 : dayOfWeek - 1)));
    
    // Create 53 weeks to cover the entire year
    for (let week = 0; week < 53; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = dataMap.get(dateStr) || 0;
        const dayData = { 
          date: dateStr, 
          count: count,
          level: count > 0 ? 1 : 0
        };
        weekData.push(dayData);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(weekData);
    }
    
    return weeks;
  };

  useEffect(() => {
    // Only fetch data if we don't have initial data
    if (!initialData) {
      const fetchHeatmapData = async () => {
        try {
          const response = await axiosInstance.get('/api/dashboard/overview');
          const apiHeatmapData = response.data.data.heatmapData || [];
          setHeatmapData(apiHeatmapData);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch heatmap data:', error);
          setHeatmapData([]);
          setLoading(false);
        }
      };

      fetchHeatmapData();
    }
  }, [initialData]);

  // Month labels
  const monthLabels = [
    'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6',
    'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'
  ];

  // Group data for display
  const groupedData = heatmapData.length > 0 ? groupDataByWeeks(heatmapData) : [];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Hoạt động học tập</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{new Date().getFullYear()}</p>
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  // Show a message if no data is available
  if (heatmapData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Hoạt động học tập</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{new Date().getFullYear()}</p>
        </div>
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500 dark:text-gray-400">Chưa có dữ liệu hoạt động học tập</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Hoạt động học tập</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{new Date().getFullYear()}</p>
      </div>
      
      <div className="flex items-center mb-4">
        <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Ít</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div 
            key={level}
            className={`w-3 h-3 rounded-sm ml-1 ${
              level === 0 ? 'bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700' :
              level === 1 ? 'bg-green-300 dark:bg-green-900/40 border border-green-300 dark:border-green-700' :
              level === 2 ? 'bg-green-400 dark:bg-green-800/60 border border-green-400 dark:border-green-600' :
              level === 3 ? 'bg-green-500 dark:bg-green-700/80 border border-green-500 dark:border-green-500' :
              'bg-green-600 dark:bg-green-600 border border-green-600 dark:border-green-400'
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Nhiều</span>
      </div>
      
      <div className="flex justify-center w-full overflow-x-auto pb-4">
        <div className="flex">
          {/* Weekday labels on the left */}
          <div className="flex flex-col mr-2 text-[10px] text-gray-500 dark:text-gray-400">
            <div className="h-4"></div> {/* Spacer for alignment */}
            <div className="h-3 flex items-center justify-end pr-1">T2</div>
            <div className="h-3"></div> {/* Spacer */}
            <div className="h-3 flex items-center justify-end pr-1">T4</div>
            <div className="h-3"></div> {/* Spacer */}
            <div className="h-3 flex items-center justify-end pr-1">T6</div>
            <div className="h-3"></div> {/* Spacer */}
            <div className="h-3 flex items-center justify-end pr-1">CN</div>
          </div>
          
          {/* Main heatmap */}
          <div className="flex">
            {groupedData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col mx-0.5">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm mb-1 ${getLevelColor(day.count)} hover:opacity-75 transition-opacity cursor-pointer`}
                    title={`${day.date}: ${day.count} thẻ`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Month labels */}
      <div className="flex justify-center text-xs text-gray-500 dark:text-gray-400 mt-2">
        <div className="w-10"></div> {/* Spacer for weekday labels */}
        <div className="flex" style={{ width: `${53 * 17}px` }}>
          {monthLabels.map((month, index) => {
            // Calculate width for each month based on weeks
            const weeksPerMonth = 53 / 12;
            return (
              <div 
                key={index} 
                className="text-center"
                style={{ width: `${weeksPerMonth * 17}px` }}
              >
                {month}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}