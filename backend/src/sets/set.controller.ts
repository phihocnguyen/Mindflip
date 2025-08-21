import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus, Query } from '@nestjs/common';
import { SetsService } from './set.service';
import { CreateSetDto } from './dto/create-set.dto';
import { UpdateSetDto } from './dto/update-set.dto';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateTermDto } from '../term/dto/update-term.dto';
import { MatchGameDto } from './dto/match-game.dto';

@ApiBearerAuth()
@ApiTags('Sets')
@UseGuards(AuthGuard('jwt'))
@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo một bộ từ vựng mới' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Tạo thành công.' })
  create(@Body() createSetDto: CreateSetDto, @Req() req: Request) {
    const userId = req.user!['_id'];
    return this.setsService.create(createSetDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách các bộ từ của người dùng' })
  findAll(@Req() req: Request, @Query('page') page?: number, @Query('limit') limit?: number) {
    const userId = req.user!['_id'];
    if (page !== undefined && limit !== undefined) {
      return this.setsService.findAllForUserPaginated(userId, page, limit);
    }
    return this.setsService.findAllForUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một bộ từ theo ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lấy dữ liệu thành công.'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Không có quyền truy cập.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy bộ từ.'})
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user!['_id'];
    return this.setsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật một bộ từ' })
  update(@Param('id') id: string, @Body() updateSetDto: UpdateSetDto, @Req() req: Request) {
    const userId = req.user!['_id'];
    return this.setsService.update(id, updateSetDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một bộ từ' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user!['_id'];
    return this.setsService.remove(id, userId);
  }

  @Patch(':setId/terms/:termId')
  @ApiOperation({ summary: 'Cập nhật trạng thái một thẻ từ (đã thuộc/chưa thuộc)' })
  updateTermStatus(
    @Param('setId') setId: string,
    @Param('termId') termId: string,
    @Body() updateTermDto: UpdateTermDto,
    @Req() req: Request,
  ) {
    const userId = req.user!['_id'];
    return this.setsService.updateTermStatus(setId, termId, updateTermDto, userId);
  }

  @Get(':id/random-terms')
  @ApiOperation({ summary: 'Lấy dữ liệu cho game Nối từ' })
  getMatchGame(
    @Param('id') id: string,
    @Req() req: Request,
    @Query() query: MatchGameDto,
  ) {
    const userId = req.user!['_id'];
    return this.setsService.findRandomTermsForGame(id, userId, query.limit as number);
  }
}