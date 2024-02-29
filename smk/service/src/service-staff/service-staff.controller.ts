import { Controller, Get } from '@nestjs/common';
import { ServiceStaffService } from './service-staff.service';
import { ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/auth/userInfo.decorator';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';
import { Roles } from 'src/auth/roles-auth.decorator';

@Controller('service-staff')
@ApiTags('Штатка')
export class ServiceStaffController {
  constructor(private readonly serviceStaffService: ServiceStaffService) {}

  @Get('/departments')
  getDeparments() {
    return this.serviceStaffService.getDepartmentsCached();
  }

  @Get('/employees')
  getEmployees() {
    return this.serviceStaffService.getEmployeesCached();
  }

  @Get('/employed-employees')
  getEmployedEmployees() {
    return this.serviceStaffService.getEmployeedEmployeesCached();
  }

  @Roles()
  @Get('/whoami')
  getMyRoles(@UserInfo() userInfo: UserInfoDto) {
    return this.serviceStaffService.getRolesWithDeputy(userInfo.EmployeeId);
  }
}
