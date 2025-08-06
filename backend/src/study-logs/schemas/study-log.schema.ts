import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { StudySet } from 'src/sets/schemas/set.schema';
import { User } from 'src/users/schemas/user.schema';

export type StudyLogDocument = HydratedDocument<StudyLog>;

@Schema({ timestamps: true })
export class StudyLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'StudySet' })
  setId?: StudySet;

  @Prop({ type: String, enum: ['MATCHING', 'QUIZ', 'WRITING', 'LISTENING', 'SPEAKING', 'FILL', 'TERM_LEARNED'], required: true })
  activityType: string;

  @Prop({ type: Number, default: 0 })
  durationSeconds: number; // Thời gian học (giây)

  @Prop({ type: Number })
  correctAnswers?: number; // Số câu trả lời đúng

  @Prop({ type: Number })
  totalItems?: number; // Tổng số câu hỏi/từ vựng
}

export const StudyLogSchema = SchemaFactory.createForClass(StudyLog);