import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { TimeRange } from './dto/leaderboard-query.dto';

interface GetLeaderboardOptions {
  userId: string;
  page: number;
  limit: number;
  search?: string;
  timeRange?: TimeRange;
}

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async getLeaderboard(options: GetLeaderboardOptions) {
    const { userId, page, limit, search, timeRange } = options;
    const currentUser = await this.userModel.findById(userId).select('score name avatar _id');
    
    if (timeRange !== 'all') {
        // Logic xử lý cho weekly/monthly (hiện tại chưa implement)
        // ...
        return { message: `Time range filter for '${timeRange}' is not implemented yet.` };
    }
    

    const [totalUsers, totalPosts, highestScoreUser, avgScoreResult] = await Promise.all([
      this.userModel.countDocuments(),
      this.postModel.countDocuments(),
      this.userModel.findOne().sort({ score: -1 }).select('score'),
      this.userModel.aggregate([{ $group: { _id: null, avgScore: { $avg: '$score' } } }]),
    ]);

    const kpis = {
      totalUsers,
      totalPosts,
      highestScore: highestScoreUser?.score || 0,
      averageScore: Math.round(avgScoreResult[0]?.avgScore || 0),
    };

    // --- Tính hạng của người dùng hiện tại ---
    const userRank = await this.userModel.countDocuments({ score: { $gt: currentUser!.score } }) + 1;
    const currentUserData = { rank: userRank, score: currentUser!.score, user: currentUser };

    // --- Lấy danh sách bảng xếp hạng ---
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const [leaderboardData, totalLeaderboard] = await Promise.all([
        this.userModel.find(query)
            .sort({ score: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('name avatar score') // Chọn các trường cần thiết
            .exec(),
        this.userModel.countDocuments(query),
    ]);
    
    const leaderboard = {
        data: leaderboardData,
        hasMore: totalLeaderboard > page * limit,
    };

    return { kpis, currentUser: currentUserData, leaderboard };
  }
}