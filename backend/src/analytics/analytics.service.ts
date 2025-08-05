import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as moment from 'moment-timezone';
import { StudySet, StudySetDocument } from '../sets/schemas/set.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { StudyLog, StudyLogDocument } from 'src/study-logs/schemas/study-log.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(StudyLog.name) private logModel: Model<StudyLogDocument>,
    @InjectModel(StudySet.name) private setModel: Model<StudySetDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    // Đặt múi giờ mặc định cho toàn bộ service
    moment.tz.setDefault('Asia/Ho_Chi_Minh');
  }

  /**
   * Hàm chính: Lấy toàn bộ dữ liệu cho dashboard
   */
  async getDashboardData(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const user = await this.userModel.findById(userObjectId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }

    // Chạy song song tất cả các truy vấn để tối ưu hiệu suất
    const [kpis, weeklyData, monthlyData, detailedStats] = await Promise.all([
      this.calculateKpis(user),
      this.getWeeklyChartData(userObjectId),
      this.getMonthlyChartData(userObjectId),
      this._calculateDetailedStats(user),
    ]);

    return { kpis, weeklyChart: weeklyData, monthlyChart: monthlyData, detailedStats };
  }

  /**
   * Tính toán các chỉ số KPI chính
   */
  private async calculateKpis(user: UserDocument) {
    const userId = user._id;
    const sets = await this.setModel.find({ creatorId: userId });
    const logs = await this.logModel.find({ userId });

    const totalSets = sets.length;
    const completedSets = sets.filter((s) => s.isCompleted).length;

    const totalTerms = sets.reduce((sum, set) => sum + set.terms.length, 0);
    const learnedTerms = sets.reduce(
      (sum, set) => sum + set.terms.filter((t) => t.isLearned).length,
      0,
    );

    const totalStudyTimeSeconds = logs.reduce((sum, log) => sum + log.durationSeconds, 0);

    const quizLogs = logs.filter(
      (log) => log.activityType === 'QUIZ' && typeof log.totalItems === 'number' && log.totalItems > 0,
    );
    const totalCorrect = quizLogs.reduce((sum, log) => sum + (log.correctAnswers ?? 0), 0);
    const totalQuestions = quizLogs.reduce((sum, log) => sum + log.totalItems!, 0);
    const overallAccuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;

    const currentStreak = await this._calculateCurrentStreak(userId);

    return {
      completedSets,
      totalSets,
      learnedTerms,
      totalTerms,
      currentStreak,
      totalStudyTimeSeconds,
      overallAccuracy,
    };
  }

  /**
   * Lấy dữ liệu cho biểu đồ tuần
   */
  private async getWeeklyChartData(userId: Types.ObjectId) {
    const startOfWeek = moment().startOf('isoWeek').toDate();
    const endOfWeek = moment().endOf('day').toDate();

    const weeklyLogs = await this.logModel.aggregate([
      { $match: { userId, createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
      {
        $group: {
          _id: { $dayOfWeek: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } }, // 1=CN, 2=T2,...
          totalDurationSeconds: { $sum: '$durationSeconds' },
          totalCorrect: { $sum: '$correctAnswers' },
          totalItems: { $sum: '$totalItems' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const studyTime = Array(7).fill(0);
    const accuracy = Array(7).fill(0);

    weeklyLogs.forEach((item) => {
      const dayIndex = (item._id + 5) % 7; // Chuyển đổi sang index 0-6 (T2-CN)
      studyTime[dayIndex] = Math.round(item.totalDurationSeconds / 60);
      accuracy[dayIndex] =
        item.totalItems > 0 ? Math.round((item.totalCorrect / item.totalItems) * 100) : 0;
    });

    return { labels, accuracy, studyTime };
  }

  /**
   * Lấy dữ liệu cho biểu đồ tháng
   */
  private async getMonthlyChartData(userId: Types.ObjectId) {
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');

    const monthlyLogs = await this.logModel.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() },
          activityType: { $in: [
            'QUIZ', 
            'MATCHING', 
            'WRITING', 
            'LISTENING', 
            'SPEAKING', 
            'FILL'
          ] }, 
          totalItems: { $gt: 0 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const startWeek = startOfMonth.isoWeek();
    const endWeek = endOfMonth.isoWeek();
    
    // Xử lý trường hợp tháng 12 có tuần 52, 53 và tháng 1 có tuần 1
    const weekCount = (endWeek < startWeek) 
      ? (moment(startOfMonth).isoWeeksInYear() - startWeek + 1) + endWeek 
      : endWeek - startWeek + 1;
      
    const labels = Array.from({ length: weekCount }, (_, i) => `Tuần ${i + 1}`);
    const accuracy = Array(weekCount).fill(0);

    monthlyLogs.forEach((item) => {
      let weekIndex = item._id - startWeek;
      if (item._id < startWeek) { // Ví dụ: Tuần 1 của năm mới so với tuần 52 của năm cũ
        weekIndex = item._id + moment(startOfMonth).isoWeeksInYear() - startWeek;
      }

      if (weekIndex >= 0 && weekIndex < weekCount) {
        accuracy[weekIndex] = Math.round((item.totalCorrect / item.totalItems) * 100);
      }
    });

    return { labels, accuracy };
  }

  /**
   * Tính toán chuỗi ngày học liên tiếp HIỆN TẠI
   */
  private async _calculateCurrentStreak(userId: Types.ObjectId): Promise<number> {
    const uniqueStudyDays = await this.logModel.aggregate([
      { $match: { userId } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } } } },
      { $sort: { _id: -1 } },
    ]);

    if (uniqueStudyDays.length === 0) return 0;

    let streak = 0;
    const today = moment();
    const mostRecentStudyDay = moment(uniqueStudyDays[0]._id);

    if (today.diff(mostRecentStudyDay, 'days') > 1) return 0;
    
    streak = 1;
    let previousDay = mostRecentStudyDay;

    for (let i = 1; i < uniqueStudyDays.length; i++) {
      const currentDay = moment(uniqueStudyDays[i]._id);
      if (previousDay.diff(currentDay, 'days') === 1) {
        streak++;
        previousDay = currentDay;
      } else {
        break;
      }
    }
    return streak;
  }

  /**
   * Tính toán chuỗi ngày học DÀI NHẤT
   */
  private async _calculateLongestStreak(userId: Types.ObjectId): Promise<number> {
    const uniqueStudyDays = await this.logModel.aggregate([
        { $match: { userId } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } } } },
        { $sort: { _id: 1 } }
    ]);

    if (uniqueStudyDays.length === 0) return 0;

    let longestStreak = 1;
    let currentStreak = 1;
    for (let i = 1; i < uniqueStudyDays.length; i++) {
        const day1 = moment(uniqueStudyDays[i - 1]._id);
        const day2 = moment(uniqueStudyDays[i]._id);
        if (day2.diff(day1, 'days') === 1) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }
        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
        }
    }
    return longestStreak;
  }

  /**
   * Tính toán các chỉ số chi tiết (so sánh với quá khứ)
   */
  private async _calculateDetailedStats(user: UserDocument) {
    const todayStart = moment().startOf('day').toDate();
    const yesterdayStart = moment().subtract(1, 'days').startOf('day').toDate();
    const sevenDaysAgo = moment().subtract(7, 'days').startOf('day').toDate();
    const fourteenDaysAgo = moment().subtract(14, 'days').startOf('day').toDate();

    // 1. Từ đã học hôm nay & % thay đổi
    const termsToday = (await this.logModel.find({ userId: user._id, createdAt: { $gte: todayStart } })).reduce((sum, log) => sum + (log.totalItems ?? 0), 0);
    const termsYesterday = (await this.logModel.find({ userId: user._id, createdAt: { $gte: yesterdayStart, $lt: todayStart } })).reduce((sum, log) => sum + (log.totalItems ?? 0), 0);
    const newTermsChange = termsYesterday > 0 ? (termsToday - termsYesterday) / termsYesterday : (termsToday > 0 ? 1 : 0);

    // 2. Độ chính xác & % thay đổi
    const recentLogs = await this.logModel.find({ userId: user._id, activityType: 'QUIZ', createdAt: { $gte: sevenDaysAgo } });
    const recentCorrect = recentLogs.reduce((sum, log) => sum + (log.correctAnswers ?? 0), 0);
    const recentItems = recentLogs.reduce((sum, log) => sum + (log.totalItems ?? 0), 0);
    const averageAccuracy = recentItems > 0 ? recentCorrect / recentItems : 0;

    const previousLogs = await this.logModel.find({ userId: user._id, activityType: 'QUIZ', createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } });
    const previousCorrect = previousLogs.reduce((sum, log) => sum + (log.correctAnswers ?? 0), 0);
    const previousItems = previousLogs.reduce((sum, log) => sum + (log.totalItems ?? 0), 0);
    const previousAccuracy = previousItems > 0 ? previousCorrect / previousItems : 0;
    const averageAccuracyChange = previousAccuracy > 0 ? (averageAccuracy - previousAccuracy) / previousAccuracy : (averageAccuracy > 0 ? 1 : 0);

    // 3. Chuỗi dài nhất & thay đổi
    const longestStreak = await this._calculateLongestStreak(user._id);
    const longestStreakChange = longestStreak - user.longestStreakRecord;
    if (longestStreak > user.longestStreakRecord) {
      user.longestStreakRecord = longestStreak;
      await user.save();
    }

    return {
      newTermsToday: termsToday,
      newTermsChange,
      averageAccuracy,
      averageAccuracyChange,
      longestStreak,
      longestStreakChange,
    };
  }
}