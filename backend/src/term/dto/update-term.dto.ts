import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateTermDto {
  @ApiProperty({ description: 'Trạng thái đã thuộc của thẻ', example: true })
  @IsBoolean()
  @IsNotEmpty()
  isLearned: boolean;
}