import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';

export class TermDto {
    @ApiProperty({ example: 'Hello', description: 'Thuật ngữ' })
    @IsString()
    @IsNotEmpty()
    term: string;
    
    @ApiProperty({ example: 'Xin chào', description: 'Định nghĩa của thuật ngữ' })
    @IsString()
    @IsNotEmpty()
    definition: string;
  }