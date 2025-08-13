import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import moment from 'moment-timezone';
import { User, UserDocument } from '../users/schemas/user.schema';
import { StudyLog, StudyLogDocument } from '../study-logs/schemas/study-log.schema';
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
    const [kpis, skillDistribution, termStatus, cardsPerSet, heatmapData, recentSets, mostStudiedSets] = await Promise.all([
      this._getKpis(userObjectId),
      this._getSkillDistribution(userObjectId),
      this._getTermStatusDistribution(userObjectId),
      this._getCardsPerSet(userObjectId),
      this._getHeatmapData(userObjectId, thirtyDaysAgo),
      this._getRecentSets(userObjectId),
      this._getMostStudiedSets(userObjectId),
    ]);

    return {
      kpis,
      skillDistribution,
      termStatusDistribution: termStatus,
      cardsPerSet,
      heatmapData,
      recentSets,
      mostStudiedSets,
    };
  }

  // --- Các hàm tính toán con ---

  private async _getKpis(userId: Types.ObjectId) {
    const sets = await this.setModel.find({ creatorId: userId });
    const logs = await this.logModel.find({ userId });

    const totalSets = sets.length;
    const totalTerms = sets.reduce((sum, set) => sum + set.terms.length, 0);
    const publicSets = sets.filter(s => s.isPublic).length;
    
    // Tính bộ từ được ôn tập nhiều nhất
    const setStudyCounts = new Map<string, number>();
    logs.forEach(log => {
      if (log.setId) {
        const count = setStudyCounts.get(log.setId.toString()) || 0;
        setStudyCounts.set(log.setId.toString(), count + 1);
      }
    });
    
    let mostStudiedSetCount = 0;
    if (setStudyCounts.size > 0) {
      mostStudiedSetCount = Math.max(...setStudyCounts.values());
    }
    
    const studyTimeSeconds = logs.reduce((sum, log) => sum + (log.durationSeconds || 0), 0);

    return { 
      totalSets, 
      totalTerms, 
      publicSets, 
      privateSets: totalSets - publicSets, 
      studyTimeSeconds,
      mostStudiedSetCount
    };
  }

  private async _getMostStudiedSets(userId: Types.ObjectId) {
    // Lấy tất cả study logs của user
    const logs = await this.logModel.find({ userId });
    
    // Đếm số lần mỗi bộ từ được ôn tập
    const setStudyCounts = new Map<string, {count: number, setId: string}>();
    logs.forEach(log => {
      if (log.setId) {
        const setId = log.setId.toString();
        const current = setStudyCounts.get(setId) || {count: 0, setId};
        setStudyCounts.set(setId, {count: current.count + 1, setId});
      }
    });
    
    // Chuyển sang array và sắp xếp theo số lần ôn tập giảm dần
    const sortedSets = Array.from(setStudyCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Lấy top 5
    
    // Lấy thông tin chi tiết của các bộ từ
    const setIds = sortedSets.map(item => new Types.ObjectId(item.setId));
    const sets = await this.setModel.find({
      _id: { $in: setIds }
    }).select('_id title');
    
    // Map lại với số lần ôn tập
    const setMap = new Map(sets.map(set => [set._id.toString(), set.title]));
    return sortedSets.map(item => ({
      name: setMap.get(item.setId) || 'Bộ từ không xác định',
      count: item.count
    }));
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
      return this.setModel.find({ creatorId: userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('_id title');
  }
}