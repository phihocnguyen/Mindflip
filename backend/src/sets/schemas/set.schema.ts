import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Term, TermSchema } from 'src/term/schemas/term.schema';
import { User } from 'src/users/schemas/user.schema';

export type StudySetDocument = HydratedDocument<StudySet>;

@Schema({ timestamps: true })
export class StudySet {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  creatorId: User;

  @Prop({ type: [TermSchema], default: [] })
  terms: Term[];

  @Prop({ type: Boolean, default: false })
  isPublic: boolean;
}

export const StudySetSchema = SchemaFactory.createForClass(StudySet);