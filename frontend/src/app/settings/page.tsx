'use client';

import { useState } from 'react';
import { Suspense } from 'react';
import Sidebar from '../../components/Sidebar';
import ProfileSettings from './components/ProfileSettings';
import AccountSettings from './components/AccountSettings';
import NotificationSettings from './components/NotificationSettings';
import PrivacySettings from './components/PrivacySettings';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sets] = useState([]); // Mock data

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
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Cài đặt</h1>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Desktop Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Cài đặt
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Quản lý thông tin cá nhân và tùy chọn tài khoản
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <Suspense fallback={<LoadingSpinner isLoading />}>
                <ProfileSettings />
              </Suspense>

              <Suspense fallback={<LoadingSpinner isLoading />}>
                <AccountSettings />
              </Suspense>

              <Suspense fallback={<LoadingSpinner isLoading/>}>
                <NotificationSettings />
              </Suspense>

              <Suspense fallback={<LoadingSpinner isLoading />}>
                <PrivacySettings />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 