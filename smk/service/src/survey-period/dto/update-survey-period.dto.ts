import { PartialType } from '@nestjs/swagger';
import { CreateSurveyPeriodDto } from './create-survey-period.dto';

export class UpdateSurveyPeriodDto extends PartialType(CreateSurveyPeriodDto) {}
