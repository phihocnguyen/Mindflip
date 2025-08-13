import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export enum PostCategory {
  TOEIC = 'TOEIC',
  IELTS = 'IELTS',
  GIAO_TIEP = 'Giao tiếp',
  MEO_HOC_TAP = 'Mẹo học tập',
  CAU_HOI = 'Câu hỏi',
}

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ type: String, enum: PostCategory, required: true })
  category: PostCategory;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
  likes: Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  commentCount: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);