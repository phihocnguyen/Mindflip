'use client';

interface Set {
  _id: string;
  title: string;
}

interface SetSelectorProps {
  sets: Set[];
  selectedSetId: string;
  wordLimit: number;
  loading: boolean;
  onSetChange: (setId: string) => void;
  onWordLimitChange: (limit: number) => void;
  onApplyChanges: () => void;
}

export default function SetSelector({
  sets,
  selectedSetId,
  wordLimit,
  loading,
  onSetChange,
  onWordLimitChange,
  onApplyChanges,
}: SetSelectorProps) {
  return (
    <div className="flex items-center space-x-4">
      {sets.length > 0 ? (
        <>
          <select
            value={selectedSetId}
            onChange={(e) => onSetChange(e.target.value)}
            disabled={loading}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
          >
            {sets.map((set) => (
              <option key={set._id} value={set._id}>
                {set.title}
              </option>
            ))}
          </select>
          <select
            value={wordLimit}
            onChange={(e) => onWordLimitChange(Number(e.target.value))}
            disabled={loading}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
          >
            <option value={10}>10 từ</option>
            <option value={20}>20 từ</option>
            <option value={30}>30 từ</option>
            <option value={40}>40 từ</option>
            <option value={50}>50 từ</option>
          </select>
          <button
            onClick={onApplyChanges}
            disabled={loading}
            className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            Áp dụng
          </button>
        </>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400">Không có bộ từ vựng</div>
      )}
    </div>
  );
}