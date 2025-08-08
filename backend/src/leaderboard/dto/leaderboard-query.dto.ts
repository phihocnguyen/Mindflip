import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum TimeRange {
  ALL = 'all',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum Level {
  MASTER = 'Master',
  EXPERT = 'Expert',
  ADVANCED = 'Advanced',
  INTERMEDIATE = 'Intermediate',
  BEGINNER = 'Beginner',
}

export class LeaderboardQueryDto {
  @ApiPropertyOptional({ description: 'Số trang', default: 1 })
  @Type(() => Number) @IsInt() @Min(1) @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Số lượng trên mỗi trang', default: 10 })
  @Type(() => Number) @IsInt() @Min(1) @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Tìm kiếm theo tên người dùng' })
  @IsString() @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: TimeRange, default: TimeRange.ALL })
  @IsEnum(TimeRange) @IsOptional()
  timeRange?: TimeRange = TimeRange.ALL;

  @IsString()
  @IsOptional()
  level?: string;
}