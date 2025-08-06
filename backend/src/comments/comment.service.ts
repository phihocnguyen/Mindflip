import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Post, PostDocument } from 'src/posts/schemas/post.schema';

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
}