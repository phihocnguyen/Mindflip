import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import {PostsService} from './post.service';
import {CommentsService} from 'src/comments/comment.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { PostCategory } from './schemas/post.schema';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';


@ApiBearerAuth()
@ApiTags('Community (Posts & Comments)')
@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo bài đăng mới' })
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const userId = req.user!['_id'];
    return this.postsService.create(createPostDto, userId );
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài đăng (có thể lọc theo category)' })
  findAll(@Query('category') category?: PostCategory) {
    return this.postsService.findAll(category);
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một bài đăng' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một bài đăng' })
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.postsService.remove(id, req.user!['_id']);
  }
  
  @Post(':id/like')
  @ApiOperation({ summary: 'Thích hoặc bỏ thích một bài đăng' })
  toggleLike(@Param('id') id: string, @Req() req: Request) {
    return this.postsService.toggleLike(id, req.user!['_id']);
  }
  
  @Post(':id/comments')
  @ApiOperation({ summary: 'Tạo bình luận mới cho bài đăng' })
  createComment(
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    return this.commentsService.create(postId, createCommentDto, req.user!['_id']);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Lấy tất cả bình luận của một bài đăng' })
  findAllComments(@Param('id') postId: string) {
    return this.commentsService.findAllForPost(postId);
  }
}