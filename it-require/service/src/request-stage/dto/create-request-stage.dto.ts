import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRequestStageDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsNumber()
  nextStageId: number | null;
  @IsOptional()
  @IsNumber()
  previousStageId: number | null;
  @IsOptional()
  @IsString()
  roleId: string | null;
  @IsBoolean()
  initialStage: boolean;
}
