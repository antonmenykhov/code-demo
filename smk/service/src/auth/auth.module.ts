import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
//import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ServiceStaffModule } from 'src/service-staff/service-staff.module';
import { UserModule } from 'src/user/user.module';
import { ResponsibleModule } from 'src/responsible/responsible.module';

@Module({
  imports: [
    JwtModule.register({}),
    ServiceStaffModule,
    forwardRef(() => UserModule),
    ResponsibleModule
  ],
  // controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
