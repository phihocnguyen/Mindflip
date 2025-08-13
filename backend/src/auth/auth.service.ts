import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateUserDto } from './dto/create-auth.dto';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, name } = createUserDto;

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
    await this.emailService.sendVerificationEmail(email, name, verificationToken);
    
    return { message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.' };
  }

  private async _createToken(user: UserDocument) {
    const payload = { 
      sub: user._id, 
      email: user.email,
      avatar: user.avatar,
      name: user.name || user.email.split('@')[0] // Fallback về email nếu name null
    };
    console.log(payload)
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Vui lòng xác thực email trước khi đăng nhập.');
    }

    const isPasswordMatching = user.password && await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }

    return this._createToken(user);
  }

  async validateOAuthUser(googleId: string, email: string, name: string, avatar: string) {
    let user = await this.userModel.findOne({ googleId });
    console.log(name)
    if (!user) {
      user = await this.userModel.create({
        googleId,
        email,
        name,
        avatar,
        isEmailVerified: true, // Email từ Google được coi là đã xác thực
      });
    } else {
      // Nếu user đã tồn tại nhưng name bị null hoặc khác, cập nhật lại
      if (!user.name || user.name !== name) {
        user.name = name;
        await user.save();
      }
    }

    return this._createToken(user);
  }

  async verifyEmail(token: string) {
    // Tìm người dùng với token tương ứng
    const user = await this.userModel.findOne({
      emailVerificationToken: token,
    });

    if (!user) {
      throw new NotFoundException('Token xác thực không hợp lệ hoặc đã hết hạn.');
    }

    // Kích hoạt tài khoản và xóa token
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return { message: 'Xác thực email thành công.' };
  }
}