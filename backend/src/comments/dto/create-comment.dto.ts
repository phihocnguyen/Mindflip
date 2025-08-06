import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Bài viết rất hữu ích, cảm ơn bạn!' })
  @IsString()
  @IsNotEmpty()
  content: string;
}