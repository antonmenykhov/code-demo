import { Injectable } from '@nestjs/common';
import { CreateUserInfoDto } from './dto/create-user-info.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { DefaultCrud } from 'src/classes/default-crud.class';
import { UserInfo } from './entities/user-info.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UserInfoService extends DefaultCrud<
  UserInfo,
  CreateUserInfoDto,
  UpdateUserInfoDto
> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(UserInfo, dataSource);
  }
}
