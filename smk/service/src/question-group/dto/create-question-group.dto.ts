import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateQuestionGroupDto {
  @IsString()
  name: string;
  @IsNumber()
  order: number;
  @IsString()
  departmentId: string;
  @IsBoolean()
  disableZeroAnswers: boolean;
}
