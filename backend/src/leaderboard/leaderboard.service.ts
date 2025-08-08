import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as moment from 'moment-timezone';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { StudyLog, StudyLogDocument } from 'src/study-logs/schemas/study-log.schema';
import { Level, TimeRange } from './dto/leaderboard-query.dto';

interface GetLeaderboardOptions {
  userId: string;
  page: number;
  limit: number;
  search?: string;
  timeRange?: TimeRange;
  level?: string;
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

  private _getScoreRangeForLevel(level: Level) {
    switch (level) {
      case Level.MASTER: return { $gte: 9500 };
      case Level.EXPERT: return { $gte: 9000, $lt: 9500 };
      case Level.ADVANCED: return { $gte: 8500, $lt: 9000 };
      case Level.INTERMEDIATE: return { $gte: 8000, $lt: 8500 };
      case Level.BEGINNER: return { $lt: 8000 };
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

    if (timeRange !== 'all') {
      return { kpis: null, currentUser: null, leaderboard: { data: [], page: 1, totalPages: 0 } };
    }
    const currentUserPromise = this.userModel.findById(userId).select('score name avatar _id createdAt');
    const kpisPromise = Promise.all([
      this.userModel.countDocuments(),
      this.postModel.countDocuments(),
      this.userModel.findOne().sort({ score: -1 }).select('score'),
      this.userModel.aggregate([{ $group: { _id: null, avgScore: { $avg: '$score' } } }]),
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

    const userRank = await this.userModel.countDocuments({
      $or: [
        { score: { $gt: currentUser.score } },
        { score: currentUser.score, createdAt: { $lt: currentUser.createdAt } }
      ] 
    }) + 1;
    const currentUserData = { rank: userRank, score: currentUser.score, user: currentUser };

    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (level && level !== 'all') {
      const scoreRange = this._getScoreRangeForLevel(level as Level);
      if (scoreRange) {
        query.score = scoreRange;
    }
}
    
    const [leaderboardData, total] = await Promise.all([
        this.userModel.find(query)
            .sort({ score: -1, createdAt: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('name avatar score')
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