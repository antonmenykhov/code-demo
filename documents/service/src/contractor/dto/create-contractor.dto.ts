import { IsOptional, IsString } from 'class-validator';

export class CreateContractorDto {
  @IsString()
  email: string;
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  shortName?: string;
  @IsString()
  reqisits: string;
  @IsString()
  address: string;
}
