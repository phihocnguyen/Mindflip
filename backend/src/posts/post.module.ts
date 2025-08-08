import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './post.controller';
import { PostsService } from './post.service';
import { Post, PostSchema } from './schemas/post.schema';
import { CommentsModule } from 'src/comments/comment.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema }
    
    ]),
    CommentsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [MongooseModule],
})
export class PostsModule {}