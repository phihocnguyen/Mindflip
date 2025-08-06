import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateStudyLogDto } from './dto/create-log.dto';
import { AuthGuard } from '@nestjs/passport';
import { StudyLogsService } from './study-log.service';
@ApiBearerAuth()
@ApiTags('StudyLogs')
@UseGuards(AuthGuard('jwt'))
@Controller('logs')
export class StudyLogsController {
  constructor(private readonly studyLogsService: StudyLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo 1 hoạt động' })
  createLog(@Body() createStudyLogDto: CreateStudyLogDto, @Req() req: Request) {
    const userId = req.user!['_id'];
    return this.studyLogsService.create(createStudyLogDto, userId);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Lấy 3 hoạt động học tập gần nhất' })
  findRecentLogs(@Req() req: Request) {
    const userId = req.user!['_id'];
    return this.studyLogsService.findRecent(userId, 3);
  }
}