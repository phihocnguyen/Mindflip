'use client';

import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="heading-1 mb-6 text-gray-900 dark:text-white">
            Chào mừng đến với{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Mindflip
            </span>
          </h1>
          <p className="text-body max-w-3xl mx-auto mb-12 text-lg text-gray-700 dark:text-gray-200">
            Hệ thống đăng ký và đăng nhập an toàn được xây dựng với Next.js và NestJS. 
            Trải nghiệm giao diện hiện đại và bảo mật cao.
          </p>
          
          {isAuthenticated ? (
            <div className="mt-12">
              <div className="card max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="heading-2 mb-4 text-green-600 dark:text-green-400">
                    Đăng nhập thành công!
                  </h2>
                  <p className="text-body mb-4 text-gray-700 dark:text-gray-200">
                    Email: <span className="font-semibold text-indigo-600 dark:text-indigo-300">{user?.email || 'N/A'}</span>
                  </p>
                  <p className="text-small text-gray-500 dark:text-gray-400">
                    Bạn có thể bắt đầu sử dụng các tính năng của ứng dụng.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-12 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/register"
                className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Đăng ký ngay
                </span>
              </Link>
              <Link
                href="/login"
                className="btn-secondary text-lg px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Đăng nhập
                </span>
              </Link>
            </div>
          )}
        </div>

        <div className="mt-24">
          <h2 className="heading-2 text-center mb-12 text-gray-900 dark:text-white">Tính năng nổi bật</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card bg-white dark:bg-gray-900 dark:border-gray-800 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="heading-3 mb-2 text-gray-900 dark:text-white">Bảo mật cao</h3>
                  <p className="text-body text-gray-700 dark:text-gray-200">
                    Hệ thống bảo mật với JWT và mã hóa mật khẩu, đảm bảo thông tin người dùng được bảo vệ tối đa.
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-900 dark:border-gray-800 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="heading-3 mb-2 text-gray-900 dark:text-white">Hiệu suất cao</h3>
                  <p className="text-body text-gray-700 dark:text-gray-200">
                    Được xây dựng với Next.js và NestJS hiện đại, mang lại trải nghiệm nhanh chóng và mượt mà.
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-900 dark:border-gray-800 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="heading-3 mb-2 text-gray-900 dark:text-white">Dễ sử dụng</h3>
                  <p className="text-body text-gray-700 dark:text-gray-200">
                    Giao diện thân thiện và trải nghiệm người dùng tốt, phù hợp với mọi thiết bị.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
