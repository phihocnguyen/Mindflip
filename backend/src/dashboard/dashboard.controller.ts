import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';

@ApiBearerAuth()
@ApiTags('Dashboard')
@UseGuards(AuthGuard('jwt'))
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Lấy toàn bộ dữ liệu cho trang dashboard tổng quan' })
  getDashboardOverview(@Req() req: Request) {
    const userId = req.user!['_id'];
    return this.dashboardService.getDashboardOverview(userId);
  }
}