import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { StudySet, StudySetSchema } from '../sets/schemas/set.schema';
import { StudyLog, StudyLogSchema } from '../study-logs/schemas/study-log.schema';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudyLog.name, schema: StudyLogSchema },
      { name: StudySet.name, schema: StudySetSchema },
    ]),
    UsersModule
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}