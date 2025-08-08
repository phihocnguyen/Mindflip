import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, required: false, default: null })
  name: string;

  @Prop({ type: String, required: false, default: null })
  password?: string;

  @Prop({ default: null })
  avatar?: string;

  @Prop({ default: null })
  googleId?: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: null })
  emailVerificationToken?: string;

  @Prop({ type: Number, default: 0 })
  longestStreakRecord: number;

  @Prop({ type: Number, default: 0, index: true })
  score: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Tự động hash mật khẩu trước khi lưu
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});