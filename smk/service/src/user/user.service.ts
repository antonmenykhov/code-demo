import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entiries/user.entity';
import { ServiceStaffService } from 'src/service-staff/service-staff.service';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private serviceStaffService: ServiceStaffService,
  ) {}
  private repository = this.databaseService.connection.getRepository(User);
  findAll() {
    return this.repository.find();
  }

  async create(createUserDto: CreateUserDto) {
    await this.serviceStaffService.addRoleForUser(
      createUserDto.userId,
      'RESPONDENT',
    );
    const existUser = await this.repository.findOne({
      withDeleted: true,
      where: { userId: createUserDto.userId },
    });
    if (existUser) return this.repository.restore({ userId: existUser.userId });
    return this.repository.save(createUserDto);
  }

  async remove(id: number) {
    const user = await this.repository.findOne(id);
    if (user)
      await this.serviceStaffService.deleteRoleForUser(
        user.userId,
        'RESPONDENT',
      );
    return this.repository.softDelete(id);
  }

  async checkUserExist(employeeId: string) {
    return (
      (await this.repository.find({ where: { userId: employeeId } })).length > 0
    );
  }

  async getAllUsersWithInfo() {
    const allEmployes = this.serviceStaffService.getEmployeesCached();
    return (await this.findAll())
      .map(
        (user) =>
          allEmployes.find((emp) => emp.employeeId === user.userId) || null,
      )
      .filter((emp) => emp !== null);
  }
}
