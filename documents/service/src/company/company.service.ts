import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { DefaultCrud } from 'src/classes/default-crud.class';
import { Company } from './entities/company.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CompanyService extends DefaultCrud<
  Company,
  CreateCompanyDto,
  UpdateCompanyDto
> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Company, dataSource);
  }

  findAll(): Promise<Company[]> {
    return this.repository.find({
      relations: { additionalSigners: true, defaultEmail: true },
    });
  }

  findOne(id: number): Promise<Company> {
    return this.repository.findOne({
      where: { id },
      relations: { additionalSigners: true, defaultEmail: true },
      order: { id: 'ASC', additionalSigners: { id: 'ASC' } },
    });
  }

  async update(
    id: number,
    createDto: UpdateCompanyDto,
  ): Promise<UpdateCompanyDto & { id: number } & Company> {
    await this.repository.save({ id, ...createDto });
    return this.findOne(id);
  }

  async create(
    createDto: CreateCompanyDto,
  ): Promise<CreateCompanyDto & Company> {
    return {
      ...(await this.repository.save(createDto)),
      additionalSigners: [],
    };
  }
}
