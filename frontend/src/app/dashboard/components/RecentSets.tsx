import Link from 'next/link';

interface RecentSet {
  _id: string;
  title: string;
}

interface RecentSetsProps {
  recentSets: RecentSet[];
}

export default function RecentSets({ recentSets }: RecentSetsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bộ từ gần đây</h2>
        <Link
          href="/sets"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
        >
          Xem tất cả
        </Link>
      </div>
      {recentSets.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Chưa có bộ từ nào</p>
      ) : (
        <div className="space-y-3">
          {recentSets.map((set) => (
            <div key={set._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{set.title}</h3>
              </div>
              <Link
                href={`/sets/${set._id}/study`}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                Học
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}