import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';


export class TermDto {
    @IsString()
    @IsNotEmpty()
    term: string;
  
    @IsString()
    @IsNotEmpty()
    definition: string;
  }