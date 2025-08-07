'use client';
import { Post } from '../types';
import { useAuthStore } from '~/hooks/authStore';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import TimeAgo from 'react-timeago';
import viStrings from 'react-timeago/lib/language-strings/vi';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';


const formatter = buildFormatter(viStrings);

const getCategoryLabel = (category: string) => {
  const labels: { [key: string]: string } = {
    'TOEIC': 'TOEIC',
    'IELTS': 'IELTS',
    'Giao tiếp': 'Giao tiếp',
    'Mẹo học tập': 'Mẹo học tập',
    'Câu hỏi': 'Câu hỏi',
  };
  return labels[category] || 'Chung';
};

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'TOEIC': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'IELTS': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Giao tiếp': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Mẹo học tập': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Câu hỏi': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};
// --------------------

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onCommentClick: (postId: string) => void;
  onDelete: (postId: string) => void;
  currentUserId: string
}

export default function PostCard({ post, onLike, onCommentClick, onDelete }: PostCardProps) {
  const { user } = useAuthStore();
  const isLiked = user ? post.likes.includes(user.id) : false;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {post.author.avatar 
            ? <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" /> 
            : post.author.name.charAt(0).toUpperCase()
          }
        </div>
        <div className="flex-1">
          {/* --- PHẦN JSX ĐÃ ĐƯỢC HOÀN THIỆN --- */}
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium text-gray-900 dark:text-white">{post.author.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
              {getCategoryLabel(post.category)}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <TimeAgo date={post.createdAt} formatter={formatter} />
          </p>
        </div>
      </div>

      <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
      
      <div className="flex items-center space-x-6">
        <button onClick={() => onLike(post._id)} className={`flex items-center space-x-2 text-sm transition-colors ${isLiked ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'}`}>
          <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
          <span>{post.likes.length}</span>
        </button>
        <button onClick={() => onCommentClick(post._id)} className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>{post.commentCount}</span>
        </button>
        <button className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <Share2 className="w-4 h-4" />
          <span>Chia sẻ</span>
        </button>
      </div>
    </div>
  );
}