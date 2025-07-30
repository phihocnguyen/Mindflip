import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateUserDto } from './dto/create-auth.dto';
import { EmailService } from 'src/email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, username } = createUserDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại.');
    }
    
    // Tạo token xác thực
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const createdUser = new this.userModel({
      ...createUserDto,
      emailVerificationToken: verificationToken,
      isEmailVerified: false,
    });

    await createdUser.save();

    // Gửi email xác thực bằng service mới
    await this.emailService.sendVerificationEmail(email, username, verificationToken);
    
    return { message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.' };
  }
}