'use client';
import { useState } from 'react';
import { useAuthStore } from '~/hooks/useAuth';

interface ReplyFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
}

export default function ReplyForm({ onSubmit, onCancel }: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ml-11 mt-2">
      <div className="flex items-end space-x-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 flex space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-full px-4 py-2 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Viết câu trả lời..."
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white text-sm font-medium rounded-full transition-colors disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? '...' : 'Gửi'}
          </button>
        </div>
      </div>
    </form>
  );
}