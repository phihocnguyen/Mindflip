import { IsString, IsNotEmpty, IsEnum, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ActivityType {
  QUIZ = 'QUIZ',
  MATCHING = 'MATCHING',
  WRITING = 'WRITING',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING',
  FILL = "FILL",
  TERM_LEARNED = 'TERM_LEARNED',
  SET_COMPLETED = "SET_COMPLETED"
}

export class CreateStudyLogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  setId: string;

  @ApiProperty({ enum: ActivityType })
  @IsEnum(ActivityType)
  @IsNotEmpty()
  activityType: ActivityType;

  @ApiProperty()
  @IsInt()
  @Min(0)
  durationSeconds: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  correctAnswers?: number;
  
  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  totalItems?: number;
}