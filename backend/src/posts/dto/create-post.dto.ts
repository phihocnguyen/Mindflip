import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PostCategory } from '../schemas/post.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Chia sẻ kinh nghiệm học TOEIC...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: PostCategory, example: PostCategory.TOEIC })
  @IsEnum(PostCategory)
  @IsNotEmpty()
  category: PostCategory;
}