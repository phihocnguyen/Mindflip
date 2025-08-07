import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Post, PostDocument } from 'src/posts/schemas/post.schema';
import { PaginationDto } from 'src/posts/dto/pagination.dto';

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
    return newComment.save();
  }

  findAllForPost(postId: string) {
    return this.commentModel
      .find({ post: postId })
      .populate('author', 'name avatar')
      .sort({ createdAt: 1 })
      .exec();
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
    const parentComment = await this.commentModel.findById(parentCommentId);
    if (!parentComment) {
      throw new NotFoundException('Bình luận gốc không tồn tại.');
    }

    const newReply = new this.commentModel({
      ...createCommentDto,
      author: authorId,
      post: parentComment.post,
      parentCommentId: parentCommentId,
    });

    await Promise.all([
      this.commentModel.updateOne({ _id: parentCommentId }, { $inc: { replyCount: 1 } }),
      this.postModel.updateOne({ _id: parentComment.post }, { $inc: { commentCount: 1 } })
    ]);
    
    const savedReply = await newReply.save();
    return savedReply.populate('author', 'name avatar');
  }

  async findReplies(parentCommentId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 5 } = paginationDto;
    const query = { parentCommentId: new Types.ObjectId(parentCommentId) };
    
    const [replies, total] = await Promise.all([
      this.commentModel
        .find(query)
        .populate('author', 'name avatar')
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