import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { PaginationDto } from '../posts/dto/pagination.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async create(postId: string, createCommentDto: CreateCommentDto, authorId: string) {
    const newComment = new this.commentModel({
      ...createCommentDto,
      author: authorId,
      post: postId,
    });
    // Tăng commentCount trên bài post
    await this.postModel.updateOne({ _id: postId }, { $inc: { commentCount: 1 } });
    const savedComment = await newComment.save();
    return savedComment.populate('author', 'name avatar');
  }

  async findAllForPost(postId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 5 } = paginationDto;
    const query = { 
      post: new Types.ObjectId(postId),
      parentCommentId: null 
    };
    
    const [comments, total] = await Promise.all([
      this.commentModel
        .find(query)
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.commentModel.countDocuments(query).exec()
    ]);
    
    const hasMore = total > page * limit;

    return {
      data: comments,
      hasMore,
    };
  }

  async toggleLike(commentId: string, userId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận.');
    }

    const userObjectId = new Types.ObjectId(userId);
    const likeIndex = comment.likes.findIndex(id => id.equals(userObjectId));

    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(userObjectId as any);
    }

    const updatedComment = await comment.save();
    return updatedComment.populate('author', 'name avatar');
  }

  async addReply(parentCommentId: string, createCommentDto: CreateCommentDto, authorId: string) {
    const repliedComment = await this.commentModel.findById(parentCommentId);
    if (!repliedComment) {
      throw new NotFoundException('Bình luận bạn đang trả lời không tồn tại.');
    }
    const ultimateParentId = repliedComment.parentCommentId || repliedComment._id;
    const newReply = new this.commentModel({
      ...createCommentDto,
      author: authorId,
      post: repliedComment.post,
      parentCommentId: ultimateParentId,
      replyToUser: repliedComment.author
    });

    await Promise.all([
      this.commentModel.updateOne({ _id: ultimateParentId }, { $inc: { replyCount: 1 } }),
      this.postModel.updateOne({ _id: repliedComment.post }, { $inc: { commentCount: 1 } })
    ]);
    
    const savedReply = await newReply.save();
    return savedReply.populate([
        { path: 'author', select: 'name avatar' },
        { path: 'replyToUser', select: 'name' }
    ]);
  }

  async findReplies(parentCommentId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 5 } = paginationDto;
    const query = { parentCommentId: new Types.ObjectId(parentCommentId) };
    
    const [replies, total] = await Promise.all([
      this.commentModel
        .find(query)
        .populate([
            { path: 'author', select: 'name avatar' },
            { path: 'replyToUser', select: 'name' }
        ])
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.commentModel.countDocuments(query).exec()
    ]);
    
    const hasMore = total > page * limit;

    return { data: replies, hasMore };
  }
}