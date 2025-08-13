import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import moment from 'moment-timezone';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { StudyLog, StudyLogDocument } from '../study-logs/schemas/study-log.schema';
import { Level, LevelFilter, TimeRange } from './dto/leaderboard-query.dto';

interface GetLeaderboardOptions {
  userId: string;
  page: number;
  limit: number;
  search?: string;
  timeRange?: TimeRange;
  level?: LevelFilter;
}

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(StudyLog.name) private logModel: Model<StudyLogDocument>,
  ) {
    moment.tz.setDefault('Asia/Ho_Chi_Minh');
  }

  private _getScoreRangeForLevel(level: LevelFilter) {
    switch (level) {
      case LevelFilter.MASTER: return { $gte: 9500 };
      case LevelFilter.EXPERT: return { $gte: 9000, $lt: 9500 };
      case LevelFilter.ADVANCED: return { $gte: 8500, $lt: 9000 };
      case LevelFilter.INTERMEDIATE: return { $gte: 8000, $lt: 8500 };
      case LevelFilter.BEGINNER: return { $lt: 8000 };
      default: return null;
    }
  }

  private _getLevel(score: number): string {
    if (score >= 9500) return 'Master';
    if (score >= 9000) return 'Expert';
    if (score >= 8500) return 'Advanced';
    if (score >= 8000) return 'Intermediate';
    return 'Beginner';
  }


  async getLeaderboard(options: GetLeaderboardOptions) {
    const { userId, page, limit, search, timeRange, level } = options;

    const query: any = {};

    // Xử lý search filter
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Xử lý level filter
    if (level && level !== LevelFilter.ALL) {
      const scoreRange = this._getScoreRangeForLevel(level);
      if (scoreRange) {
        query.score = scoreRange;
      }
    }
    
    // Xử lý timeRange filter
    if (timeRange && timeRange !== 'all') {
      const now = moment();
      let startDate;
      
      if (timeRange === 'weekly') {
        startDate = now.clone().startOf('week');
      } else if (timeRange === 'monthly') {
        startDate = now.clone().startOf('month');
      } else if (timeRange === 'yearly') {
        startDate = now.clone().startOf('year');
      }
      
      if (startDate) {
        query.createdAt = { $gte: startDate.toDate() };
      }
    }

    const currentUserPromise = this.userModel.findById(userId).select('score name avatar _id createdAt');
    const kpisPromise = Promise.all([
      this.userModel.countDocuments(), // Count tất cả users
      this.postModel.countDocuments(), // Không thay đổi
      this.userModel.findOne().sort({ score: -1 }).select('score'), // Không thay đổi
      this.userModel.aggregate([{ $group: { _id: null, avgScore: { $avg: '$score' } } }]), // Không filter
    ]).then(([totalUsers, totalPosts, highestScoreUser, avgScoreResult]) => ({
      totalUsers,
      totalPosts,
      highestScore: highestScoreUser?.score || 0,
      averageScore: Math.round(avgScoreResult[0]?.avgScore || 0),
    }));
    
    const [currentUser, kpis] = await Promise.all([currentUserPromise, kpisPromise]);

    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }

    // Tính thứ hạng của người dùng trong toàn bộ danh sách (không filter)
    const globalUserRank = await this.userModel.countDocuments({
      $or: [
        { score: { $gt: currentUser.score } },
        { score: currentUser.score, createdAt: { $lt: currentUser.createdAt } }
      ] 
    }) + 1;
    const currentUserData = { rank: globalUserRank, score: currentUser.score, user: currentUser };

    const [leaderboardData, total] = await Promise.all([
        this.userModel.find(query)
            .sort({ score: -1, createdAt: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('name avatar score createdAt')
            .exec(),
        this.userModel.countDocuments(query),
    ]);
    
    const totalPages = Math.ceil(total / limit);

    const userIds = leaderboardData.map(u => u._id);
    const lastActivities = await this.logModel.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $sort: { createdAt: -1 } },
        { $group: { _id: '$userId', lastActive: { $first: '$createdAt' } } }
    ]);
    const lastActivitiesMap = new Map(lastActivities.map(a => [a._id.toString(), a.lastActive]));

    const finalLeaderboard = leaderboardData.map(user => ({
        _id: user._id.toString(),
        name: user.name,
        avatar: user.avatar,
        score: user.score,
        level: this._getLevel(user.score),
        lastActive: lastActivitiesMap.get(user._id.toString()) || null,
    }));

    return {
      kpis,
      currentUser: currentUserData,
      leaderboard: { data: finalLeaderboard, page, totalPages },
    };
  }
}