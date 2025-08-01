import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsBoolean } from 'class-validator';

export class TermDto {
    @ApiProperty({ example: 'Hello', description: 'Thuật ngữ' })
    @IsString()
    @IsNotEmpty()
    term: string;
    
    @ApiProperty({ example: 'Xin chào', description: 'Định nghĩa của thuật ngữ' })
    @IsString()
    @IsNotEmpty()
    definition: string;

    @ApiProperty({ description: 'Trạng thái của thuật ngữ' })
    @IsBoolean()
    @IsOptional()
    isLearned: boolean;
  }