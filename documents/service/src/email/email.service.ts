import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { DefaultCrud } from 'src/classes/default-crud.class';
import { Email } from './entities/email.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class EmailService extends DefaultCrud<
  Email,
  CreateEmailDto,
  UpdateEmailDto
> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Email, dataSource);
  }

  async findWithPassword(id: number) {
    return this.repository.findOne({
      where: { id },
      select: { host: true, login: true, password: true, port: true },
    });
  }
}
