import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class MatchGameDto {
  @ApiPropertyOptional({
    description: 'Số lượng cặp từ cần lấy',
    default: 10,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}