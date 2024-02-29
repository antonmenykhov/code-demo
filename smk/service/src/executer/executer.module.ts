import { Module } from '@nestjs/common';
import { ExecuterService } from './executer.service';
import { ExecuterController } from './executer.controller';
import { EmailerModule } from 'src/emailer/emailer.module';
import { SurveyPeriodModule } from 'src/survey-period/survey-period.module';
import { ActionModule } from 'src/action/action.module';

@Module({
  controllers: [ExecuterController],
  providers: [ExecuterService],
  imports: [EmailerModule, SurveyPeriodModule, ActionModule],
})
export class ExecuterModule {}
