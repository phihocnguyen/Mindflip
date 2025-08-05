import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('Analytics')
@UseGuards(AuthGuard('jwt'))
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Lấy toàn bộ dữ liệu cho trang dashboard tiến độ' })
  getDashboardData(@Req() req: Request) {
    const userId = req.user!['_id'];
    return this.analyticsService.getDashboardData(userId);
  }
}