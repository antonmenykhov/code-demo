import { Injectable } from '@nestjs/common';
import { CreateUserSignDto } from './dto/create-user-sign.dto';
import { UpdateUserSignDto } from './dto/update-user-sign.dto';
import { DefaultCrud } from 'src/classes/default-crud.class';
import { UserSign } from './entities/user-sign.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UserSignService extends DefaultCrud<
  UserSign,
  CreateUserSignDto,
  UpdateUserSignDto
> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(UserSign, dataSource);
  }

  async findByUserId(userId: string) {
    return await this.dataSource
      .getRepository(UserSign)
      .findOne({ where: { userId }, relations: { attachment: true } });
  }
}
