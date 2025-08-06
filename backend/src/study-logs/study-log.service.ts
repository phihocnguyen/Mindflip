import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { StudyLog, StudyLogDocument } from './schemas/studylog.schema';
import { CreateStudyLogDto } from './dto/create-log.dto';
import { StudyLog, StudyLogDocument } from './schemas/study-log.schema';

@Injectable()
export class StudyLogsService {
  constructor(
    @InjectModel(StudyLog.name) private logModel: Model<StudyLogDocument>,
  ) {}

  async create(createStudyLogDto: CreateStudyLogDto, userId: string): Promise<StudyLog> {
    const newLog = new this.logModel({
      ...createStudyLogDto,
      userId,
    });
    return newLog.save();
  }

  async findRecent(userId: string, limit = 3): Promise<StudyLog[]> {
    return this.logModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('setId', 'title')
      .exec();
  }
}