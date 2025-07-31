import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test@example.com', description: 'Email của người dùng' })
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu (ít nhất 6 ký tự)' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  password: string;
}