import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
@Schema({ _id: true, timestamps: true })
export class Term {
  _id: Types.ObjectId;

  @Prop({ required: true })
  term: string; // Thuật ngữ

  @Prop({ required: true })
  definition: string; // Định nghĩa

  @Prop({ type: Boolean, default: false })
  isLearned: boolean;
}

export const TermSchema = SchemaFactory.createForClass(Term);