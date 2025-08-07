'use client';
import { Post } from '../types';
import PostCard from './PostCard';
import CommentModal from './CommentModal';
import { useState } from 'react';

interface CommunityPostsProps {
  posts: Post[];
  loading: boolean;
  onLike: (postId: string) => void;
  onCommentPosted: (postId: string, newCommentCount: number) => void;
  onDeletePost: (postId: string) => void;
}

export default function CommunityPosts({ posts, loading, onLike, onCommentPosted, onDeletePost }: CommunityPostsProps) {
  const [modalPostId, setModalPostId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-6">
              {/* ... JSX cho skeleton loading ... */}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onLike={onLike}
            onCommentClick={setModalPostId}
            onDelete={onDeletePost}
            currentUserId={post.author._id}
          />
        ))}
        {posts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Chưa có bài viết nào.</p>
          </div>
        )}
      </div>

      {modalPostId && (
        <CommentModal
          postId={modalPostId}
          onClose={() => setModalPostId(null)}
          onCommentPosted={onCommentPosted}
        />
      )}
    </div>
  );
}