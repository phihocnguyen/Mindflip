import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: true, timestamps: true })
export class Term {
  @Prop({ required: true })
  term: string; // Thuật ngữ

  @Prop({ required: true })
  definition: string; // Định nghĩa
}

export const TermSchema = SchemaFactory.createForClass(Term);