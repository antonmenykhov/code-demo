import { Injectable } from '@nestjs/common';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { DefaultCrud } from 'src/classes/default-crud.class';
import { Contractor } from './entities/contractor.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ContractorService extends DefaultCrud<
  Contractor,
  CreateContractorDto,
  UpdateContractorDto
> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Contractor, dataSource);
  }
  findAll(): Promise<Contractor[]> {
    return this.repository.find({
      relations: { directors: true },
      order: { name: 'ASC', directors: { id: 'ASC' } },
    });
  }
  findOne(id: number): Promise<Contractor> {
    return this.repository.findOne({
      where: { id },
      relations: { directors: true },
      order: { directors: { id: 'ASC' } },
    });
  }
  async update(
    id: number,
    createDto: UpdateContractorDto,
  ): Promise<UpdateContractorDto & { id: number } & Contractor> {
    await this.repository.save({ id, ...createDto });
    return this.findOne(id);
  }

  createMany(createContractorDtos: CreateContractorDto[]) {
    return this.repository.save(createContractorDtos);
  }
}
