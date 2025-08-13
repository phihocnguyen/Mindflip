import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết người dùng theo ID' })
  @ApiResponse({ status: 200, description: 'Trả về thông tin người dùng, bộ từ vựng công khai và bài viết cộng đồng.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng.' })
  async getUserProfile(@Param('id') id: string) {
    const userData = await this.usersService.getUserProfile(id);
    
    if (!userData) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }
    
    return {
      success: true,
      data: userData,
    };
  }
}