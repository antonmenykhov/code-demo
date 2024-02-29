import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDelegationDto {
  @IsString()
  fromId: string;
  @IsString()
  toId: string;
  @IsNumber()
  documentId: number;
  @IsString()
  description: string;
  @IsString()
  date: string;
  @IsOptional()
  @IsNumber()
  parentId: number;
  @IsOptional()
  @IsBoolean()
  isNeedAprooving?: boolean;
  isActive?: boolean;
}
