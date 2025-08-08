import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { TimeRange } from './dto/leaderboard-query.dto';
import { StudyLog, StudyLogDocument } from 'src/study-logs/schemas/study-log.schema';

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
    @InjectModel(StudyLog.name) private logModel: Model<StudyLogDocument>
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
    const [leaderboardData, total] = await Promise.all([
        this.userModel.find(query)
            .sort({ score: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('name avatar score')
            .exec(),
        this.userModel.countDocuments(query),
    ]);
    const userIds = leaderboardData.map(u => u._id);
    const lastActivities = await this.logModel.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $sort: { createdAt: -1 } },
        { $group: { _id: '$userId', lastActive: { $first: '$createdAt' } } }
    ]);
    const lastActivitiesMap = new Map(lastActivities.map(a => [a._id.toString(), a.lastActive]));

    const finalLeaderboard = leaderboardData.map(user => ({
        ...user.toObject(),
        level: this._getLevel(user.score),
        lastActive: lastActivitiesMap.get(user._id.toString()) || null,
    }));


    const totalPages = Math.ceil(total / limit);
    
    return {
      kpis,
      currentUser: currentUserData,
      leaderboard: { data: finalLeaderboard, page, totalPages },
    };
  }

  private _getLevel(score: number): string {
    if (score > 9500) return 'Master';
    if (score > 9000) return 'Expert';
    if (score > 8500) return 'Advanced';
    if (score > 8000) return 'Intermediate';
    return 'Beginner';
  }
}