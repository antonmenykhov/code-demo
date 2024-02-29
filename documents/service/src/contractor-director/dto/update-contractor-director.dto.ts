import { PartialType } from '@nestjs/swagger';
import { CreateContractorDirectorDto } from './create-contractor-director.dto';

export class UpdateContractorDirectorDto extends PartialType(CreateContractorDirectorDto) {}
