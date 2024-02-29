import { Module } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { EmailerController } from './emailer.controller';
import { DatabaseModule } from 'src/database/database.module';
import { SurveyPeriodModule } from 'src/survey-period/survey-period.module';
import { AuthModule } from 'src/auth/auth.module';
import { ResponsibleModule } from 'src/responsible/responsible.module';
import { UserModule } from 'src/user/user.module';
import { ServiceStaffModule } from 'src/service-staff/service-staff.module';

@Module({
  controllers: [EmailerController],
  providers: [EmailerService],
  imports: [
    DatabaseModule,
    SurveyPeriodModule,
    AuthModule,
    ResponsibleModule,
    UserModule,
    ServiceStaffModule,
  ],
  exports: [EmailerService],
})
export class EmailerModule {}
