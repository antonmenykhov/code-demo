import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { ServiceStaffModule } from 'src/service-staff/service-staff.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [forwardRef(() => AuthModule), DatabaseModule, ServiceStaffModule],
  exports: [UserService],
})
export class UserModule {}
