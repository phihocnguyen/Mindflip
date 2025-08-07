import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Community')
@UseGuards(AuthGuard('jwt'))
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Lấy các chỉ số thống kê chung của cộng đồng' })
  getStats() {
    return this.communityService.getStats();
  }


  @Get('leaderboard')
  @ApiOperation({ summary: 'Lấy bảng xếp hạng top 5 users và top 5 posts' })
  getLeaderboard() {
    return this.communityService.getLeaderboard();
  }
}