import Link from 'next/link';

interface Card {
  term: string;
  definition: string;
}

interface Set {
  _id: string;
  title: string;
  description: string;
  terms: Card[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SetCardProps {
  set: Set;
  onDelete: (setId: string) => void;
}

export default function SetCard({ set, onDelete }: SetCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {set.title}
            </h3>
            {set.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {set.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {set.terms.length} thẻ
              </div>
              <div className="text-xs text-gray-400">
                {new Date(set.updatedAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
          {set.isPublic && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Công khai
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          <Link
            href={`/sets/${set._id}/study`}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 text-center"
          >
            Học
          </Link>
          <Link
            href={`/sets/${set._id}/edit`}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 text-center"
          >
            Sửa
          </Link>
          <button
            onClick={() => onDelete(set._id)}
            className="flex-1 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
} 