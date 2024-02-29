import { Injectable } from '@nestjs/common';
import { CreateContractorDirectorDto } from './dto/create-contractor-director.dto';
import { UpdateContractorDirectorDto } from './dto/update-contractor-director.dto';
import { DefaultCrud } from 'src/classes/default-crud.class';
import { ContractorDirector } from './entities/contractor-director.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ContractorDirectorService extends DefaultCrud<
  ContractorDirector,
  CreateContractorDirectorDto,
  UpdateContractorDirectorDto
> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(ContractorDirector, dataSource);
  }

  createMany(createDirectorDtos: CreateContractorDirectorDto[]) {
    return this.repository.save(createDirectorDtos);
  }
}
