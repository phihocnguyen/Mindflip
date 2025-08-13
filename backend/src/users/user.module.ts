import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
// import { Set, SetSchema } from '../sets/schemas/set.schema';
import { StudySet, StudySetSchema } from '../sets/schemas/set.schema';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: StudySet.name, schema: StudySetSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}