import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as moment from 'moment-timezone';
import { User, UserDocument } from '../users/schemas/user.schema';
import { StudyLog, StudyLogDocument } from 'src/study-logs/schemas/study-log.schema';
import { StudySet, StudySetDocument } from '../sets/schemas/set.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(StudyLog.name) private logModel: Model<StudyLogDocument>,
    @InjectModel(StudySet.name) private setModel: Model<StudySetDocument>,
  ) {
    moment.tz.setDefault('Asia/Ho_Chi_Minh');
  }

  async getDashboardOverview(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const thirtyDaysAgo = moment().subtract(30, 'days').startOf('day').toDate();

    // Chạy song song tất cả các truy vấn
    const [kpis, skillDistribution, termStatus, cardsPerSet, heatmapData, recentSets] = await Promise.all([
      this._getKpis(userObjectId),
      this._getSkillDistribution(userObjectId),
      this._getTermStatusDistribution(userObjectId),
      this._getCardsPerSet(userObjectId),
      this._getHeatmapData(userObjectId, thirtyDaysAgo),
      this._getRecentSets(userObjectId),
    ]);

    return {
      kpis,
      skillDistribution,
      termStatusDistribution: termStatus,
      cardsPerSet,
      heatmapData,
      recentSets,
    };
  }

  // --- Các hàm tính toán con ---

  private async _getKpis(userId: Types.ObjectId) {
    const sets = await this.setModel.find({ creatorId: userId });
    const logs = await this.logModel.find({ userId });

    const totalSets = sets.length;
    const totalTerms = sets.reduce((sum, set) => sum + set.terms.length, 0);
    const publicSets = sets.filter(s => s.isPublic).length;
    const studyTimeSeconds = logs.reduce((sum, log) => sum + (log.durationSeconds || 0), 0);
    
    
    return { totalSets, totalTerms, publicSets, privateSets: totalSets - publicSets, studyTimeSeconds };
  }

  private async _getSkillDistribution(userId: Types.ObjectId) {
    return this.logModel.aggregate([
      { $match: { userId } },
      { $group: { _id: '$activityType', totalDuration: { $sum: '$durationSeconds' } } },
      { $project: { name: '$_id', value: '$totalDuration', _id: 0 } }
    ]);
  }

  private async _getTermStatusDistribution(userId: Types.ObjectId) {
      const sets = await this.setModel.find({ creatorId: userId });
      let learned = 0;
      let learning = 0;
      let fresh = 0;
      sets.forEach(set => {
          set.terms.forEach(term => {
              if (term.isLearned) {
                  learned++;
              } else {
                  fresh++;
              }
          });
      });
      return [
          { name: "Đã thuộc", value: learned },
          { name: "Đang học", value: learning },
          { name: "Từ mới", value: fresh },
      ];
  }

  private async _getCardsPerSet(userId: Types.ObjectId) {
    const sets = await this.setModel.find({ creatorId: userId }).select('title terms');
    return sets.map(set => ({
      name: set.title,
      'Số thẻ': set.terms.length,
    }));
  }

  private async _getHeatmapData(userId: Types.ObjectId, startDate: Date) {
    return this.logModel.aggregate([
      { $match: { userId, createdAt: { $gte: startDate }, activityType: 'TERM_LEARNED' } },
      { $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 } 
      }},
      { $project: { _id: 0, date: '$_id', count: '$count' } }
    ]);
  }

  private async _getRecentSets(userId: Types.ObjectId) {
      return this.logModel.aggregate([
          { $match: { userId } },
          { $sort: { createdAt: -1 } },
          { $group: { _id: '$setId', lastStudied: { $first: '$createdAt' } } },
          { $limit: 3 },
          { $lookup: { from: 'studysets', localField: '_id', foreignField: '_id', as: 'setDetails' } },
          { $unwind: '$setDetails' },
          { $project: { _id: '$setDetails._id', title: '$setDetails.title' } }
      ]);
  }
}