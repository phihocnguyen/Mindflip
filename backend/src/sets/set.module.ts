import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SetsService } from './set.service';
import { SetsController } from './set.controller';
import { StudySet, StudySetSchema } from './schemas/set.schema';
import { StudyLogsModule } from '../study-logs/study-log.module';
import { StudyLog, StudyLogSchema } from '../study-logs/schemas/study-log.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudySet.name, schema: StudySetSchema },
      { name: StudyLog.name, schema: StudyLogSchema },
      { name: User.name, schema: UserSchema }
    ]),
    StudyLogsModule
  ],
  controllers: [SetsController],
  providers: [SetsService],
})
export class SetsModule {}