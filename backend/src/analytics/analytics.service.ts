import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment-timezone';
import { StudySet, StudySetDocument } from 'src/sets/schemas/set.schema';
import { StudyLog, StudyLogDocument } from 'src/study-logs/schemas/study-log.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(StudyLog.name) private logModel: Model<StudyLogDocument>,
    @InjectModel(StudySet.name) private setModel: Model<StudySetDocument>,
  ) {}

  async getDashboardData(userId: string) {
    // Đặt múi giờ Việt Nam
    moment.tz.setDefault('Asia/Ho_Chi_Minh');
    const today = moment().endOf('day');
    const startOfWeek = moment().startOf('isoWeek');
    const startOfMonth = moment().startOf('month');

    // Chạy song song các truy vấn để tăng tốc độ
    const [kpis, weeklyData, monthlyData] = await Promise.all([
      this.calculateKpis(userId),
      this.getWeeklyChartData(userId, startOfWeek, today),
      this.getMonthlyChartData(userId, startOfMonth, today),
    ]);

    return { kpis, weeklyChart: weeklyData, monthlyChart: monthlyData };
  }

  private async calculateKpis(userId: string) {
    // Tính toán các chỉ số KPI
    const sets = await this.setModel.find({ creatorId: userId });
    const logs = await this.logModel.find({ userId });

    const totalSets = sets.length;
    const completedSets = sets.filter(s => s.isCompleted).length;

    const totalTerms = sets.reduce((sum, set) => sum + set.terms.length, 0);
    const learnedTerms = sets.reduce((sum, set) => sum + set.terms.filter(t => t.isLearned).length, 0);

    const totalStudyTimeSeconds = logs.reduce((sum, log) => sum + log.durationSeconds, 0);

    const quizLogs = logs.filter(
        log => log.activityType === 'QUIZ' && typeof log.totalItems === 'number' && log.totalItems > 0,
      );
      const currentStreak = await this._calculateCurrentStreak(userId);
    const totalCorrect = quizLogs.reduce((sum, log) => sum + (log.correctAnswers ?? 0), 0);
    const totalQuestions = quizLogs.reduce((sum, log) => sum + log.totalItems!, 0);
    const overallAccuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;
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

  private async _calculateCurrentStreak(userId: string): Promise<number> {
    // Bước 1: Lấy danh sách các ngày học duy nhất, sắp xếp giảm dần
    const uniqueStudyDays = await this.logModel.aggregate([
      // Tìm tất cả log của user
      { $match: { userId: userId } },
      // Chỉ lấy ngày, bỏ qua giờ, phút, giây
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' },
          },
        },
      },
      // Sắp xếp ngày mới nhất lên đầu
      { $sort: { _id: -1 } },
    ]);

    if (uniqueStudyDays.length === 0) {
      return 0;
    }

    // Bước 2: Lặp ngược để đếm chuỗi
    let streak = 0;
    const today = moment().tz('Asia/Ho_Chi_Minh');
    const mostRecentStudyDay = moment.tz(uniqueStudyDays[0]._id, 'Asia/Ho_Chi_Minh');
    
    // Nếu ngày học gần nhất không phải hôm nay hoặc hôm qua -> chuỗi bị ngắt
    if (today.diff(mostRecentStudyDay, 'days') > 1) {
      return 0;
    }
    
    // Nếu ngày học gần nhất là hôm nay hoặc hôm qua, bắt đầu đếm
    streak = 1;
    let previousDay = mostRecentStudyDay;

    for (let i = 1; i < uniqueStudyDays.length; i++) {
      const currentDay = moment.tz(uniqueStudyDays[i]._id, 'Asia/Ho_Chi_Minh');
      // Kiểm tra xem ngày hiện tại có phải là ngày ngay trước của ngày trước đó không
      if (previousDay.diff(currentDay, 'days') === 1) {
        streak++;
        previousDay = currentDay;
      } else {
        // Nếu có một khoảng trống, dừng đếm
        break;
      }
    }

    return streak;
  }

  private async getWeeklyChartData(userId: string, startOfWeek: moment.Moment, endOfWeek: moment.Moment) {
    const weeklyLogs = await this.logModel.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: startOfWeek.toDate(), $lte: endOfWeek.toDate() },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' }, // 1=CN, 2=T2, ..., 7=T7
          totalDurationSeconds: { $sum: '$durationSeconds' },
          totalCorrect: { $sum: '$correctAnswers' },
          totalItems: { $sum: '$totalItems' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format dữ liệu cho biểu đồ
    const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const studyTime = Array(7).fill(0);
    const accuracy = Array(7).fill(0);

    weeklyLogs.forEach(item => {
      const dayIndex = (item._id + 5) % 7; // Chuyển đổi từ 1-7 (CN-T7) sang 0-6 (T2-CN)
      studyTime[dayIndex] = Math.round(item.totalDurationSeconds / 60); // Đổi sang phút
      accuracy[dayIndex] = item.totalItems > 0 ? Math.round((item.totalCorrect / item.totalItems) * 100) : 0;
    });

    return { labels, accuracy, studyTime };
  }

  private async getMonthlyChartData(userId: string, startOfMonth: moment.Moment, endOfMonth: moment.Moment) {
      const monthlyLogs = await this.logModel.aggregate([
          {
              $match: {
                  userId: userId,
                  createdAt: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() },
                  activityType: 'QUIZ',
                  totalItems: { $gt: 0 }
              }
          },
          {
              $group: {
                  _id: { $week: '$createdAt' }, // Nhóm theo tuần
                  totalCorrect: { $sum: '$correctAnswers' },
                  totalItems: { $sum: '$totalItems' }
              }
          },
          { $sort: { _id: 1 } }
      ]);
      
      // Format dữ liệu
      const weekCount = moment().weeksInYear() - startOfMonth.weeksInYear() + 1;
      const labels = Array.from({length: weekCount}, (_, i) => `Tuần ${i + 1}`);
      const accuracy = Array(weekCount).fill(0);

      monthlyLogs.forEach(item => {
          const weekIndex = item._id - startOfMonth.week();
          if (weekIndex >= 0 && weekIndex < weekCount) {
              accuracy[weekIndex] = Math.round((item.totalCorrect / item.totalItems) * 100);
          }
      });
      
      return { labels, accuracy };
  }
}