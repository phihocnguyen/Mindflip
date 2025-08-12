import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { User, UserSchema } from '../users/schemas/user.schema';
import { StudyLog, StudyLogSchema } from 'src/study-logs/schemas/study-log.schema';
import { StudySet, StudySetSchema } from '../sets/schemas/set.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: StudyLog.name, schema: StudyLogSchema },
      { name: StudySet.name, schema: StudySetSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}