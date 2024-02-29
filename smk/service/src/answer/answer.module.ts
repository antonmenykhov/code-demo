import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { SurveyPeriodModule } from 'src/survey-period/survey-period.module';
import { ResponsibleAnswerService } from './responsible-answer.service';
import { RespondentAnswerService } from './respondent-answer.service';
import { ViewerAnswerService } from './viewer-answer.service';

@Module({
  controllers: [AnswerController],
  providers: [
    AnswerService,
    ResponsibleAnswerService,
    RespondentAnswerService,
    ViewerAnswerService,
  ],
  imports: [DatabaseModule, AuthModule, SurveyPeriodModule],
  exports: [AnswerService],
})
export class AnswerModule {}
