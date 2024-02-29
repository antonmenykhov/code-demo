import { Module, forwardRef } from '@nestjs/common';
import { ServiceStaffService } from './service-staff.service';
import { ServiceStaffController } from './service-staff.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ServiceStaffController],
  providers: [ServiceStaffService],
  exports: [ServiceStaffService],
  imports: [forwardRef(() => AuthModule)],
})
export class ServiceStaffModule {}
