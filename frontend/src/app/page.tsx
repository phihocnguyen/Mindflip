'use client';

import { useAuthStore } from '../hooks/authStore';
import Link from 'next/link';

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  console.log(user)

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
            Mindflip là nền tảng học từ vựng thông minh, tích hợp phương pháp flashcard tương tác cùng tính năng tra từ tức thời, tối ưu hóa khả năng ghi nhớ và tốc độ học ngoại ngữ.
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
            {/* Tính năng: Học từ vựng bằng flashcard */}
            <div className="card bg-white dark:bg-gray-900 dark:border-gray-800 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="heading-3 mb-2 text-gray-900 dark:text-white">Flashcard thông minh</h3>
                  <p className="text-body text-gray-700 dark:text-gray-200">
                    Học từ vựng hiệu quả với flashcard tương tác, hỗ trợ ví dụ, phát âm và hình ảnh minh hoạ.
                  </p>
                </div>
              </div>
            </div>

            {/* Tính năng: Tra từ ngay trong lúc học */}
            <div className="card bg-white dark:bg-gray-900 dark:border-gray-800 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="heading-3 mb-2 text-gray-900 dark:text-white">Tra từ tức thì</h3>
                  <p className="text-body text-gray-700 dark:text-gray-200">
                    Chạm để tra nghĩa ngay trong khi học, không cần rời bài – liền mạch, nhanh và tiện lợi.
                  </p>
                </div>
              </div>
            </div>

            {/* Tính năng: Lặp lại thông minh */}
            <div className="card bg-white dark:bg-gray-900 dark:border-gray-800 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="heading-3 mb-2 text-gray-900 dark:text-white">Lặp lại ngắt quãng</h3>
                  <p className="text-body text-gray-700 dark:text-gray-200">
                    Tự động đề xuất ôn tập theo thời điểm dễ quên nhất để ghi nhớ lâu hơn – ứng dụng SRS hiệu quả.
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
