import { PartialType } from '@nestjs/swagger';
import { CreateCompanyAdditionalSignerDto } from './create-company-additional-signer.dto';

export class UpdateCompanyAdditionalSignerDto extends PartialType(CreateCompanyAdditionalSignerDto) {}
