import { PartialType } from '@nestjs/swagger';
import { CreateDocumentReadingMarkDto } from './create-document-reading-mark.dto';

export class UpdateDocumentReadingMarkDto extends PartialType(
  CreateDocumentReadingMarkDto,
) {}
