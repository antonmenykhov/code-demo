import { PartialType } from '@nestjs/swagger';
import { CreateRequestStageDto } from './create-request-stage.dto';

export class UpdateRequestStageDto extends PartialType(CreateRequestStageDto) {}
