import { Injectable } from '@nestjs/common';
import { CreateHandbookDto } from './dto/create-handbook.dto';
import { UpdateHandbookDto } from './dto/update-handbook.dto';
import DefaultCrud from 'src/common/default-crud.class';
import { Handbook } from './entities/handbook.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HandbookService extends DefaultCrud<
  Handbook,
  CreateHandbookDto,
  UpdateHandbookDto
> {
  constructor(@InjectDataSource() private datasource: DataSource) {
    super(Handbook, datasource);
  }

  findOne(id: number): Promise<Handbook> {
    return this.repository.findOne({
      where: { id },
      relations: { items: true },
    });
  }
}
