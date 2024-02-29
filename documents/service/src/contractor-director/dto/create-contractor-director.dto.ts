import { IsNumber, IsString } from 'class-validator';

export class CreateContractorDirectorDto {
  @IsNumber()
  contractorId: number;
  @IsString()
  name: string;
  @IsString()
  formStaffName: string;
  @IsString()
  formFullName: string;
}
