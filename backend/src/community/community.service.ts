import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { Comment, CommentDocument } from '../comments/schemas/comment.schema';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async getStats() {
    const [members, posts, totalComments, likesAggregation] = await Promise.all([
      this.userModel.countDocuments().exec(),
      this.postModel.countDocuments().exec(),
      this.commentModel.countDocuments().exec(),
      this.postModel.aggregate([
        {
          $group: {
            _id: null,
            totalLikes: { $sum: { $size: '$likes' } },
          },
        },
      ]),
    ]);

    const totalLikes = likesAggregation.length > 0 ? likesAggregation[0].totalLikes : 0;
    const interactions = totalLikes + totalComments;

    return {
      members,
      posts,
      interactions,
    };
  }

  async getLeaderboard() {
    const topUsersPromise = this.postModel.aggregate([
      {
        $project: {
          author: 1,
          interactionScore: { $add: [{ $size: '$likes' }, '$commentCount'] },
        },
      },
      {
        $group: {
          _id: '$author',
          totalScore: { $sum: '$interactionScore' },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'authorInfo',
        },
      },
      { $unwind: '$authorInfo' },
      {
        $project: {
          _id: 1,
          name: '$authorInfo.name',
          avatar: '$authorInfo.avatar',
          totalScore: 1,
        },
      },
    ]);

    const topPostsPromise = this.postModel.aggregate([
      {
        $project: {
          title: 1,
          content: 1,
          category: 1,
          author: 1,
          interactionScore: { $add: [{ $size: '$likes' }, '$commentCount'] },
        },
      },
      { $sort: { interactionScore: -1 } },
      { $limit: 5 },
    ]);

    const [topUsers, topPosts] = await Promise.all([topUsersPromise, topPostsPromise]);

    return { topUsers, topPosts };
  }
}