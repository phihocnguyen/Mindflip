'use client';

import { Comment } from '../types';
import { useAuthStore } from '~/hooks/authStore';
import TimeAgo from 'react-timeago';
import viStrings from 'react-timeago/lib/language-strings/vi';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { useState } from 'react';
import ReplyForm from './ReplyForm';

const formatter = buildFormatter(viStrings);

interface CommentItemProps {
  comment: Comment;
  onLike: (id: string) => void;
  onReplySubmit: (parentId: string, content: string) => Promise<void>;
  replies: Comment[];
  hasMoreReplies: boolean;
  onFetchReplies: (parentId: string) => void;
}
export default function CommentItem({ comment, onLike, onReplySubmit, replies, hasMoreReplies, onFetchReplies }: CommentItemProps) {
  const { user } = useAuthStore();
  const isLiked = user && comment.likes.includes(user.id); 
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="flex items-start space-x-3 mt-2">
      <div className="w-8 h-8 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-medium">
          {comment.author?.name?.charAt(0).toUpperCase() || '?'}
        </span>
      </div>
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-3 py-2 inline-block">
          <p className="font-semibold text-sm text-gray-900 dark:text-white">{comment.author?.name || 'Người dùng ẩn danh'}</p>
          <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap break-words">{comment.content}</p>
        </div>
        <div className="flex items-center space-x-4 mt-1 ml-3">
          <button onClick={() => onLike(comment._id)} className={`text-xs font-semibold ${isLiked ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400'} hover:underline`}>
            {isLiked ? 'Đã thích' : 'Thích'} ({comment.likes.length})
          </button>
          <button onClick={() => setShowReplyForm(!showReplyForm)} className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:underline">
            Trả lời
          </button>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            <TimeAgo date={comment.createdAt} formatter={formatter} />
          </span>
        </div>
        <div className="pl-4 mt-2 space-y-3 border-l-2 border-gray-200 dark:border-gray-600">
          {replies.map(reply => (
            <CommentItem 
              key={reply._id}
              comment={reply}
              onLike={onLike}
              onReplySubmit={onReplySubmit}
              replies={[]}
              hasMoreReplies={false}
              onFetchReplies={() => {}}
            />
          ))}
          {hasMoreReplies && (
            <button onClick={() => onFetchReplies(comment._id)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold py-2">
              Xem thêm câu trả lời
            </button>
          )}
        </div>
        {showReplyForm && (
          <ReplyForm 
            onSubmit={(content) => onReplySubmit(comment._id, content)}
            onCancel={() => setShowReplyForm(false)}
          />
        )}
      </div>
    </div>
  );
}