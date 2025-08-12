import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as moment from 'moment-timezone';
import { StudySet, StudySetDocument } from '../sets/schemas/set.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { StudyLog, StudyLogDocument } from 'src/study-logs/schemas/study-log.schema';

const ACCURACY_ACTIVITIES = ['QUIZ', 'MATCHING', 'WRITING', 'LISTENING', 'SPEAKING', 'FILL'];

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

    const practiceLogs = logs.filter(
      (log) => ACCURACY_ACTIVITIES.includes(log.activityType) && (log.totalItems ?? 0) > 0
    );
    const totalCorrect = practiceLogs.reduce((sum, log) => sum + (log.correctAnswers ?? 0), 0);
    const totalQuestions = practiceLogs.reduce((sum, log) => sum + (log.totalItems ?? 0), 0);
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
    // Luôn làm việc với múi giờ Việt Nam một cách tường minh
    const now = moment().tz('Asia/Ho_Chi_Minh');

    // Lấy khoảng thời gian từ đầu tuần (Thứ Hai) đến cuối tuần (Chủ Nhật)
    const startOfWeek = now.clone().startOf('isoWeek').toDate();
    const endOfWeek = now.clone().endOf('isoWeek').toDate();

    const weeklyLogs = await this.logModel.aggregate([
      { $match: { userId, activityType: { $in: ACCURACY_ACTIVITIES }, createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
      {
        $group: {
          _id: { $dayOfWeek: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } },
          totalDurationSeconds: { $sum: '$durationSeconds' },
          totalCorrect: { $sum: { $ifNull: ['$correctAnswers', 0] } },
          totalItems: { $sum: { $ifNull: ['$totalItems', 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const studyTime = Array(7).fill(0);
    const accuracy = Array(7).fill(0);

    weeklyLogs.forEach((item) => {
      // Logic chuyển đổi index rõ ràng hơn: CN(1)->6, T2(2)->0, T3(3)->1,...
      const dayIndex = item._id === 1 ? 6 : item._id - 2;
      
      if (dayIndex >= 0 && dayIndex < 7) {
        studyTime[dayIndex] = Math.round(item.totalDurationSeconds / 60); // Đổi sang phút
        accuracy[dayIndex] =
          item.totalItems > 0 ? Math.round((item.totalCorrect / item.totalItems) * 100) : 0;
      }
    });

    return { labels, accuracy, studyTime };
  }

  /**
   * Lấy dữ liệu cho biểu đồ tháng
   */
  private async getMonthlyChartData(userId: Types.ObjectId) {
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('day').toDate();

    const monthlyLogs = await this.logModel.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          activityType: { $in: ACCURACY_ACTIVITIES },
          totalItems: { $gt: 0 },
        },
      },
      // --- BẮT ĐẦU THAY ĐỔI LOGIC ---
      {
        $project: { // Thêm một bước để tính toán tuần trong tháng
          correctAnswers: 1,
          totalItems: 1,
          // Chia ngày trong tháng cho 7 và làm tròn lên để có tuần (1, 2, 3, 4)
          weekOfMonth: {
            $ceil: {
              $divide: [{ $dayOfMonth: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } }, 7],
            },
          },
        },
      },
      {
        $group: {
          _id: '$weekOfMonth', // Bây giờ nhóm theo tuần trong tháng (1, 2, 3, 4)
          totalCorrect: { $sum: '$correctAnswers' },
          totalItems: { $sum: '$totalItems' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    // --- KẾT THÚC THAY ĐỔI LOGIC ---

    // Luôn luôn tạo ra 4 tuần
    const labels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
    const accuracy = Array(4).fill(0);

    monthlyLogs.forEach((item) => {
      // item._id bây giờ là 1, 2, 3, hoặc 4
      const weekIndex = item._id - 1;
      if (weekIndex >= 0 && weekIndex < 4) {
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
    // --- 1. Thiết lập các khoảng thời gian ---
    const todayStart = moment().startOf('day').toDate();
    const yesterdayStart = moment().subtract(1, 'days').startOf('day').toDate();
    const sevenDaysAgo = moment().subtract(7, 'days').startOf('day').toDate();
    const fourteenDaysAgo = moment().subtract(14, 'days').startOf('day').toDate();
    
    // --- 2. Tính toán "Từ vựng mới hôm nay" ---
    // Logic đúng: Chỉ đếm các log có activityType là 'TERM_LEARNED'
    const newTermsToday = await this.logModel.countDocuments({
      userId: user._id,
      createdAt: { $gte: todayStart },
      activityType: 'TERM_LEARNED',
    });

    const newTermsYesterday = await this.logModel.countDocuments({
      userId: user._id,
      createdAt: { $gte: yesterdayStart, $lt: todayStart },
      activityType: 'TERM_LEARNED',
    });

    const newTermsChange = newTermsYesterday > 0 ? (newTermsToday - newTermsYesterday) / newTermsYesterday : (newTermsToday > 0 ? 1 : 0);
    const accuracyActivityTypes = ['QUIZ', 'MATCHING', 'WRITING', 'LISTENING', 'SPEAKING', 'FILL'];
    const recentLogs = await this.logModel.find({ 
      userId: user._id, 
      activityType: { $in: accuracyActivityTypes }, // Sửa lại: Dùng $in để tính accuracy trên tất cả các loại practice
      createdAt: { $gte: sevenDaysAgo } 
    });
    const recentCorrect = recentLogs.reduce((sum, log) => sum + (log.correctAnswers ?? 0), 0);
    const recentItems = recentLogs.reduce((sum, log) => sum + (log.totalItems ?? 0), 0);
    const averageAccuracy = recentItems > 0 ? recentCorrect / recentItems : 0;

    // Lấy log của 7 ngày trước đó
    const previousLogs = await this.logModel.find({ 
      userId: user._id, 
      activityType: { $in: accuracyActivityTypes }, // Sửa lại: Dùng $in
      createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } 
    });
    const previousCorrect = previousLogs.reduce((sum, log) => sum + (log.correctAnswers ?? 0), 0);
    const previousItems = previousLogs.reduce((sum, log) => sum + (log.totalItems ?? 0), 0);
    const previousAccuracy = previousItems > 0 ? previousCorrect / previousItems : 0;
    
    // Sửa lại: Tính toán sự thay đổi bằng phép trừ trực tiếp (theo yêu cầu của ông)
    const averageAccuracyChange = averageAccuracy - previousAccuracy;

    // --- 4. Tính toán "Chuỗi dài nhất & thay đổi" ---
    const longestStreak = await this._calculateLongestStreak(user._id);
    const longestStreakChange = longestStreak - user.longestStreakRecord;
    if (longestStreak > user.longestStreakRecord) {
      user.longestStreakRecord = longestStreak;
      await user.save();
    }

    // --- 5. Trả về kết quả ---
    return {
      newTermsToday, // Sửa lại: Sửa lỗi typo ở đây
      newTermsChange,
      averageAccuracy,
      averageAccuracyChange,
      longestStreak,
      longestStreakChange,
    };
  }
}