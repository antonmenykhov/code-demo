import { PartialType } from '@nestjs/swagger';
import { CreateHandbookItemDto } from './create-handbook-item.dto';

export class UpdateHandbookItemDto extends PartialType(CreateHandbookItemDto) {}
