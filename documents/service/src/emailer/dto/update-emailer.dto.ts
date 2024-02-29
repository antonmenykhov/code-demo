import { PartialType } from '@nestjs/swagger';
import { CreateEmailerDto } from './create-emailer.dto';

export class UpdateEmailerDto extends PartialType(CreateEmailerDto) {}
