'use client';

import { Comment } from '../types';
import { useAuthStore } from '~/hooks/useAuth';
import TimeAgo from 'react-timeago';
import viStrings from 'react-timeago/lib/language-strings/vi';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { useState } from 'react';
import ReplyForm from './ReplyForm';
import { axiosInstance } from '~/libs';

const formatter = buildFormatter(viStrings);

interface CommentItemProps {
  comment: Comment;
  onLike: (id: string) => void;
  onReplySubmit: (parentId: string, content: string) => Promise<void>;
  onReplyClick: (authorName: string) => void;
}


export default function CommentItem({ comment, onLike, onReplySubmit,onReplyClick }: CommentItemProps) {
  const { user } = useAuthStore();
  const isLiked = user && comment.likes.includes(user.id); 
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);

  const handleFetchReplies = async () => {
    const res = await axiosInstance.get(`/api/comments/${comment._id}/replies`);
    setReplies(res.data.data.data);
  };

  const renderContentWithTags = (content: string) => {
    console.log('renderContentWithTags', content);
    if (!content) {
      return content;
    }

    const firstSpaceIndex = content.indexOf(' ');
    if (firstSpaceIndex === -1) {
      return (
        <strong className="text-blue-500 font-semibold cursor-pointer">
          {content}
        </strong>
      );
    }
    const tag = content.substring(0, firstSpaceIndex);
    const restOfContent = content.substring(firstSpaceIndex);
    console.log(tag,restOfContent)

    return (
      <>
        <strong className="text-blue-500 font-semibold cursor-pointer">
          {tag}
        </strong>
        {restOfContent}
      </>
    );
  };

  return (
    <div className="flex items-start space-x-3 mt-2">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
        {comment.author?.avatar ? (
          <img 
            src={comment.author.avatar} 
            alt={comment.author.name} 
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {comment.author?.name?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-3 py-2 inline-block">
          <p className="font-semibold text-sm text-gray-900 dark:text-white">{comment.author?.name || 'Người dùng ẩn danh'}</p>
          <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap break-words">
            {comment.parentCommentId && comment.replyToUser && (
              <strong className="text-blue-500 font-semibold cursor-pointer mr-1">
                @{comment.replyToUser.name}
              </strong>
            )}
            {comment.content}
          </p>
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
              onReplyClick={onReplyClick}
              onReplySubmit={onReplySubmit}
            />
          ))}
          {comment.replyCount > 0 && replies.length === 0 && (
            <button onClick={handleFetchReplies} className="text-blue-600 hover:text-blue-800 text-sm font-semibold py-2">
              Xem {comment.replyCount} câu trả lời
            </button>
          )}
        </div>
        {showReplyForm && (
          <ReplyForm 
            onSubmit={async (content) => {
              await onReplySubmit(comment._id, content);
              setShowReplyForm(false);
              handleFetchReplies(); 
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        )}
      </div>
    </div>
  );
}