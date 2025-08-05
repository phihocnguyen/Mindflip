import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudyLogsService } from './study-log.service';
import { StudyLogsController } from './study-log.controller';
import { StudyLog, StudyLogSchema } from './schemas/study-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudyLog.name, schema: StudyLogSchema }]),
  ],
  controllers: [StudyLogsController],
  providers: [StudyLogsService],
})
export class StudyLogsModule {}