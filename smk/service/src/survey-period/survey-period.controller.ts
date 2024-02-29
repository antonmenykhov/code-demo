import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { SurveyPeriodService } from './survey-period.service';
import { CreateSurveyPeriodDto } from './dto/create-survey-period.dto';
import { UpdateSurveyPeriodDto } from './dto/update-survey-period.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';

@Controller('survey-period')
@ApiTags('Периоды действия опросов')
export class SurveyPeriodController {
  constructor(private readonly surveyPeriodService: SurveyPeriodService) {}

  @Get()
  findAll() {
    return this.surveyPeriodService.findAll();
  }

  @Roles(['ADMINISTRATOR'])
  @Post()
  create(@Body() createSurveyPeriodDto: CreateSurveyPeriodDto) {
    return this.surveyPeriodService.create(createSurveyPeriodDto);
  }

  @Roles(['ADMINISTRATOR'])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSurveyPeriodDto: UpdateSurveyPeriodDto,
  ) {
    return this.surveyPeriodService.update(+id, updateSurveyPeriodDto);
  }

  @Roles(['ADMINISTRATOR'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surveyPeriodService.remove(+id);
  }
}
