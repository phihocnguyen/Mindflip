import { Controller, Post, Param, UseGuards, Req, Body, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationDto } from 'src/posts/dto/pagination.dto';

@ApiBearerAuth()
@ApiTags('Community (Posts & Comments)')
@UseGuards(AuthGuard('jwt'))
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

    @Post(':id/like')
    @ApiOperation({ summary: 'Thích hoặc bỏ thích một bình luận' })
    toggleCommentLike(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user!['_id'];
    return this.commentsService.toggleLike(id, userId);
    }

    @Post(':id/reply')
    @ApiOperation({ summary: 'Trả lời một bình luận' })
    addReply(
        @Param('id') parentCommentId: string,
        @Body() createCommentDto: CreateCommentDto,
        @Req() req: Request,
    ) {
        const userId = req.user!['_id'];
        return this.commentsService.addReply(parentCommentId, createCommentDto, userId);
    }

    @Get(':id/replies')
    @ApiOperation({ summary: 'Lấy danh sách các câu trả lời của một bình luận' })
    findReplies(
        @Param('id') parentCommentId: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.commentsService.findReplies(parentCommentId, paginationDto);
    }
}