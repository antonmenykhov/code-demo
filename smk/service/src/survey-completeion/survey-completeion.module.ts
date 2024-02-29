import { Module } from '@nestjs/common';
import { SurveyCompleteionService } from './survey-completeion.service';
import { SurveyCompleteionController } from './survey-completeion.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { SurveyPeriodModule } from 'src/survey-period/survey-period.module';

@Module({
  controllers: [SurveyCompleteionController],
  providers: [SurveyCompleteionService],
  imports: [DatabaseModule, AuthModule, UserModule, SurveyPeriodModule],
})
export class SurveyCompleteionModule {}
