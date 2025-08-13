import { Controller, Get, Post, Body, Req, Res, UseGuards, ValidationPipe, HttpStatus, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký người dùng mới' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Tạo người dùng thành công.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email đã tồn tại.' })
  register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập bằng email và mật khẩu' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Đăng nhập thành công, trả về access_token.'})
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Sai thông tin hoặc chưa xác thực email.'})
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Bắt đầu luồng đăng nhập Google' })
  async googleAuth(@Req() req) {
    // Passport sẽ tự động chuyển hướng đến Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback từ Google sau khi xác thực' })
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { access_token } = await this.authService.validateOAuthUser(
      req.user.googleId,
      req.user.email,
      req.user.name,
      req.user.avatar
    );
    // Chuyển hướng về frontend với token
    res.redirect(`https://mindflip-be.vercel.app/auth/callback?token=${access_token}`);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Lấy thông tin profile người dùng hiện tại (yêu cầu token)' })
  profile(@Req() req) {
    return req.user;
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Xác thực email bằng token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Xác thực email thành công.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Token không hợp lệ.' })
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}