import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { SurveyPeriodModule } from 'src/survey-period/survey-period.module';

@Module({
  controllers: [SurveyController],
  providers: [SurveyService],
  imports: [DatabaseModule, AuthModule, SurveyPeriodModule],
})
export class SurveyModule {}
