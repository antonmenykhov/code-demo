import { Injectable } from '@nestjs/common';
import { CreateHandbookItemDto } from './dto/create-handbook-item.dto';
import { UpdateHandbookItemDto } from './dto/update-handbook-item.dto';
import DefaultCrud from 'src/common/default-crud.class';
import { HandbookItem } from './entities/handbook-item.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HandbookItemService extends DefaultCrud<
  HandbookItem,
  CreateHandbookItemDto,
  UpdateHandbookItemDto
> {
  constructor(@InjectDataSource() private datasource: DataSource) {
    super(HandbookItem, datasource);
  }
}
