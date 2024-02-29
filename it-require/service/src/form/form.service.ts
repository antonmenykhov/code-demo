import { Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import DefaultCrud from 'src/common/default-crud.class';
import { Form } from './entities/form.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class FormService extends DefaultCrud<
  Form,
  CreateFormDto,
  UpdateFormDto
> {
  constructor(@InjectDataSource() private datasource: DataSource) {
    super(Form, datasource);
  }

  findOne(id: number): Promise<Form> {
    return this.repository.findOne({
      where: { id },
      relations: { questions: true },
    });
  }
}
