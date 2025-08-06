import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsService } from './comment.service';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { Post, PostSchema } from 'src/posts/schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}