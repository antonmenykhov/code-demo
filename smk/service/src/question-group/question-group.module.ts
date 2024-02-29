import { Module } from '@nestjs/common';
import { QuestionGroupService } from './question-group.service';
import { QuestionGroupController } from './question-group.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { ServiceStaffModule } from 'src/service-staff/service-staff.module';

@Module({
  controllers: [QuestionGroupController],
  providers: [QuestionGroupService],
  imports: [DatabaseModule, AuthModule, ServiceStaffModule],
})
export class QuestionGroupModule {}
