import Link from 'next/link';

interface EmptyStateProps {
  searchTerm: string;
}

export default function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {searchTerm ? 'Không tìm thấy bộ từ nào' : 'Chưa có bộ từ nào'}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {searchTerm 
          ? 'Thử tìm kiếm với từ khóa khác'
          : 'Tạo bộ từ đầu tiên để bắt đầu học từ vựng'
        }
      </p>
      {!searchTerm && (
        <Link
          href="/sets/create"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Tạo bộ từ đầu tiên
        </Link>
      )}
    </div>
  );
} 