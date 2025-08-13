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
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SetCardProps {
  set: Set;
  onDelete: (setId: string) => void;
}

// Hàm định dạng ngày tháng cho rõ ràng (tùy chọn, vì toLocaleDateString đã hoạt động)
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function SetCard({ set, onDelete }: SetCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group flex flex-col">
      <div className="p-6 flex-grow">
        {/* SỬA LỖI TẠI ĐÂY: Dùng flexbox để tách khối trái và phải */}
        <div className="flex items-start justify-between">
          
          {/* KHỐI BÊN TRÁI: Chứa Tiêu đề, Mô tả và Số thẻ */}
          <div className="flex-1 mr-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              <Link href={`/sets/${set._id}/study`} className="hover:underline">
                {set.title}
              </Link>
            </h3>
            {set.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {set.description}
              </p>
            )}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {set.terms.length} thẻ
            </div>
          </div>

          {/* KHỐI BÊN PHẢI: Chứa Badge và Ngày tháng */}
          <div className="flex flex-col items-end space-y-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                set.isPublic
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}
            >
              {set.isPublic ? 'Công khai' : 'Riêng tư'}
            </span>

            {set.isCompleted && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Đã hoàn thành
              </span>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatDate(set.updatedAt)}
            </div>
          </div>

        </div>
      </div>
      
      {/* KHỐI CÁC NÚT HÀNH ĐỘNG */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
            <Link href={`/sets/${set._id}/study`}  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 text-center">
                Học
            </Link>
            <Link href={`/sets/${set._id}/edit`} className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 text-center">
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