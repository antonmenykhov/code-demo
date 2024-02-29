import { IsNumber, IsString } from 'class-validator';

export class CreateCompanyAdditionalSignerDto {
  @IsString()
  name: string;
  @IsNumber()
  stampId: number;
  @IsNumber()
  companyId: number;
}
