import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { TermDto } from '../../term/dto/term.dto';

export class CreateSetDto {
  @ApiProperty({ example: 'Bộ từ vựng 1', description: 'Tiêu đề của bộ từ vựng' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false, example: 'Các từ vựng cơ bản trong sách giáo khoa.', description: 'Mô tả ngắn gọn' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ type: [TermDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TermDto)
  terms: TermDto[];

  @ApiProperty({ required: false, default: false, description: 'Đặt bộ từ là công khai?' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}