import { Module } from '@nestjs/common';
import { SurveyPeriodService } from './survey-period.service';
import { SurveyPeriodController } from './survey-period.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SurveyPeriodController],
  providers: [SurveyPeriodService],
  imports: [DatabaseModule, AuthModule],
  exports: [SurveyPeriodService],
})
export class SurveyPeriodModule {}
