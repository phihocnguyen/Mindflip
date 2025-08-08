import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto';


@ApiBearerAuth()
@ApiTags('Leaderboard')
@UseGuards(AuthGuard('jwt'))
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy dữ liệu cho trang bảng xếp hạng' })
  getLeaderboard(
    @Req() req: Request,
    @Query() query: LeaderboardQueryDto,
  ) {
    const userId = req.user!['_id'];
    const { search, timeRange, level } = query;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return this.leaderboardService.getLeaderboard({
      userId,
      page,
      limit,
      search,
      timeRange,
      level
    });
  }
}