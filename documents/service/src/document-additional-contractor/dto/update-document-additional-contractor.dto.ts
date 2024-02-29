import { PartialType } from '@nestjs/swagger';
import { CreateDocumentAdditionalContractorDto } from './create-document-additional-contractor.dto';

export class UpdateDocumentAdditionalContractorDto extends PartialType(CreateDocumentAdditionalContractorDto) {}
