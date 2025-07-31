import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SetsService } from './set.service';
import { SetsController } from './set.controller';
import { StudySet, StudySetSchema } from './schemas/set.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudySet.name, schema: StudySetSchema }]),
  ],
  controllers: [SetsController],
  providers: [SetsService],
})
export class SetsModule {}