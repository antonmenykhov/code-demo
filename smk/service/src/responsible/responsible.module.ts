import { Module } from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { ResponsibleController } from './responsible.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ServiceStaffModule } from 'src/service-staff/service-staff.module';

@Module({
  controllers: [ResponsibleController],
  providers: [ResponsibleService],
  imports: [DatabaseModule, ServiceStaffModule],
  exports: [ResponsibleService],
})
export class ResponsibleModule {}
