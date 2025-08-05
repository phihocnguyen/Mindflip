import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  createLog(@Body() createStudyLogDto: CreateStudyLogDto, @Req() req: Request) {
    const userId = req.user!['_id'];
    return this.studyLogsService.create(createStudyLogDto, userId);
  }
}