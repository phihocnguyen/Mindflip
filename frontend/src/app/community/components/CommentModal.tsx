'use client';

import { useEffect, useState, useCallback, Fragment, useRef } from 'react';
import { Post, Comment } from '../types';
import { axiosInstance } from '~/libs';
import TimeAgo from 'react-timeago';
import viStrings from 'react-timeago/lib/language-strings/vi';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {useAuthStore} from '~/hooks/useAuth';
import { Heart, MessageCircle } from 'lucide-react';
import CommentItem from './CommentItem';
const COMMENT_LIMIT = 5;
const formatter = buildFormatter(viStrings);

interface CommentModalProps {
  postId: string;
  onClose: () => void;
  onCommentPosted: (postId: string, newCommentCount: number) => void;
  onPostUpdate: (updatedPost: Post) => void;
}

export default function CommentModal({ postId, onClose, onCommentPosted, onPostUpdate }: CommentModalProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuthStore();
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likingComment, setLikingComment] = useState<string | null>(null);
  const [isLikingPost, setIsLikingPost] = useState(false);
  const [repliesState, setRepliesState] = useState<{ [key: string]: { list: Comment[], page: number, hasMore: boolean } }>({});
  const commentInputRef = useRef<HTMLInputElement>(null);


  
  const fetchComments = useCallback(async (pageNum: number, initialLoad = false) => {
    if (!hasMore && !initialLoad) return;
    if (pageNum > 1) setLoadingMore(true);

    try {
      const res = await axiosInstance.get(`/api/posts/${postId}/comments?page=${pageNum}&limit=${COMMENT_LIMIT}`);
      const data = res.data.data
      if (data) {
        setComments(prev => initialLoad ? data.data: [...prev, ...data.data]);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Lỗi khi tải bình luận:", error);
    } finally {
      if (pageNum > 1) setLoadingMore(false);
    }
  }, [postId, hasMore]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingPost(true);
      try {
        const postRes = await axiosInstance.get(`/api/posts/${postId}`);
        setPost(postRes.data.data);
        await fetchComments(1, true);
      } catch (error) {
        console.error("Lỗi khi tải bài đăng:", error);
      } finally {
        setLoadingPost(false);
      }
    };
    if(postId) {
      loadInitialData();
    }
  }, [postId]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage, false);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post(`/api/posts/${postId}/comments`, { content: newComment });
      const createdComment = res.data.data;
      setComments(prev => [createdComment, ...prev]);
      setNewComment('');
      
      // Cập nhật số lượng comment trong state post
      setPost(prevPost => {
        if (!prevPost) return prevPost;
        return {
          ...prevPost,
          commentCount: prevPost.commentCount + 1
        };
      });
      
      onCommentPosted(postId, post.commentCount + 1);

    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
        if (!user || likingComment === commentId) return;
        setLikingComment(commentId);
        try {
            const response = await axiosInstance.post(`/api/comments/${commentId}/like`);
            const updatedComment = response.data.data;
            setComments(prevComments =>
                prevComments.map(c =>
                    c._id === commentId ? updatedComment : c
                )
            );
        } catch (error) {
            console.error("Lỗi khi thích bình luận:", error);
        } finally {
            setLikingComment(null);
        }
    };

  const handleLikePost = async () => {
    if(!post || isLikingPost) return;
    setIsLikingPost(true);
    try {
        const response = await axiosInstance.post(`/api/posts/${post._id}/like`);
        const updatedPost = response.data.data;
        setPost(updatedPost);
        onPostUpdate(updatedPost);
    } catch (error) {
        console.error("Error liking post in modal:", error);
    } finally {
        setIsLikingPost(false);
    }
  }

  const handleReplyClick = (authorName: string) => {
    setNewComment(`@${authorName} `);
    commentInputRef.current?.focus();
  };

  const handleReplySubmit = async (parentCommentId: string, content: string) => {
    const res = await axiosInstance.post(`/api/comments/${parentCommentId}/reply`, { content });
    if (res.data.data) {
      setRepliesState(prev => {
        const currentReplies = prev[parentCommentId]?.list || [];
        return {
          ...prev,
          [parentCommentId]: {
            ...prev[parentCommentId],
            list: [res.data.data.data, ...currentReplies],
          }
        };
      });
      setComments(prev => prev.map(c => 
        c._id === parentCommentId ? { ...c, replyCount: c.replyCount + 1 } : c
      ));
      
      // Cập nhật số lượng comment trong state post
      setPost(prevPost => {
        if (!prevPost) return prevPost;
        return {
          ...prevPost,
          commentCount: prevPost.commentCount + 1
        };
      });
      
      onCommentPosted(postId, post.commentCount + 1);
    }
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
            </div>
        </div>
        <div className="px-4 py-2 mt-4 space-y-3">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-2 bg-gray-100 dark:bg-gray-700 rounded-2xl p-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );


  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-xl w-full max-h-[80vh] flex flex-col m-4 relative">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {loadingPost ? 'Đang tải...' : `Bài viết của ${post?.author?.name || 'Ẩn danh'}`}
          </h2>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {loadingPost ? <SkeletonLoader/> : (
          <Fragment>
            {post && (
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {post?.author?.avatar ? (
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {post?.author?.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{post?.author?.name || 'Ẩn danh'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <TimeAgo date={post.createdAt} formatter={formatter} />
                    </p>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white my-2">{post.title}</h3>
                    <p className="my-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words break-all">{post.content}</p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <button   
                            onClick={handleLikePost}
                            disabled={isLikingPost}
                            className={`flex items-center space-x-1 transition-colors ${
                                user && post.likes.includes(user.id) 
                                ? 'text-red-600 dark:text-red-400' 
                                : 'hover:text-red-600 dark:hover:text-red-400'
                            }`}
                        >
                            <Heart size={14} fill={user && post.likes.includes(user.id) ? 'currentColor' : 'none'} />
                            <span>{post.likes.length} Thích</span>
                        </button>
                        <div className="flex items-center space-x-1">
                            <MessageCircle size={14} />
                            <span>{post.commentCount} Bình luận</span>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="flex-1 overflow-y-auto px-4 py-2 mt-4">
              {(!loadingPost && comments.length === 0) ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Chưa có bình luận nào</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Hãy là người đầu tiên bình luận</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {comments.map(comment => (
                    !comment.parentCommentId 
                    &&
                    <CommentItem 
                      key={comment._id}
                      comment={comment}
                      onLike={handleLikeComment}
                      onReplySubmit={handleReplySubmit}
                      onReplyClick={handleReplyClick}
                    />
                  ))}
                  
                    {hasMore && !loadingMore && (
                      <button 
                        onClick={handleLoadMore} 
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold py-2"
                      >
                        Xem thêm bình luận
                      </button>
                    )}
                    {loadingMore && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Đang tải...</p>
                    )}
                </div>
              )}
            </div>

            {/* Comment Input - giống Facebook */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmitComment}>
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
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-full px-4 py-2 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Viết bình luận..."
                        disabled={isSubmitting}
                      />
                    </div>
                    <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white text-sm font-medium rounded-full transition-colors disabled:cursor-not-allowed flex items-center justify-center"
                        >
                        {isSubmitting && (
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isSubmitting ? 'Đang gửi...' : 'Gửi'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
}

