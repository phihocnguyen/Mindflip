import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsEnum } from 'class-validator';
import { PostCategory } from '../schemas/post.schema';
export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Số trang muốn lấy, bắt đầu từ 1',
    default: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng mục trên mỗi trang',
    default: 5,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 5;

  @ApiPropertyOptional({ enum: PostCategory, description: 'Lọc bài viết theo category' })
  @IsEnum(PostCategory)
  @IsOptional()
  category?: PostCategory;
}