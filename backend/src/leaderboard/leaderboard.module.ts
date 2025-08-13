import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { StudyLog, StudyLogSchema } from '../study-logs/schemas/study-log.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: StudyLog.name, schema: StudyLogSchema}
    ]),
  ],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
})
export class LeaderboardModule {}