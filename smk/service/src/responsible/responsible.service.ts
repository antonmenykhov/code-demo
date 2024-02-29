import { Injectable } from '@nestjs/common';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { DatabaseService } from 'src/database/database.service';
import { Responsible } from './entities/responsible.entity';
import { ServiceStaffService } from 'src/service-staff/service-staff.service';

@Injectable()
export class ResponsibleService {
  constructor(
    private databaseService: DatabaseService,
    private serviceStaffService: ServiceStaffService,
  ) {}
  private repository =
    this.databaseService.connection.getRepository(Responsible);
  async create(createResponsibleDto: CreateResponsibleDto) {
    await this.serviceStaffService.addRoleForUser(
      createResponsibleDto.userId,
      'RESPONSIBLE',
    );
    return this.repository.save(createResponsibleDto);
  }

  async remove(id: number) {
    const responsible = await this.repository.findOne(id);
    if (responsible)
      await this.serviceStaffService.deleteRoleForUser(
        responsible.userId,
        'RESPONSIBLE',
      );
    return this.repository.delete(id);
  }

  async checkExistResponsible(userId: string) {
    return (await this.repository.count({ where: { userId } })) > 0;
  }

  async findAllResponsibleWithInfo() {
    const responsibles = await this.repository.find();
    const employees = this.serviceStaffService.getEmployeedEmployeesCached();
    return responsibles
      .map(
        (responsible) =>
          employees.find((emp) => emp.employeeId === responsible.userId) ||
          null,
      )
      .filter((emp) => emp !== null);
  }
}
