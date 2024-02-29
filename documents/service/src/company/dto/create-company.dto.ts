import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  email: string;
  @IsString()
  name: string;
  @IsString()
  reqisits: string;
  @IsString()
  manager: string;
  @IsString()
  address: string;
  @IsNumber()
  stampId: number;
  @IsNumber()
  headerId: number;
  @IsOptional()
  @IsString()
  pathToDir: string;
  @IsString()
  defaultEmailId: number;
}
