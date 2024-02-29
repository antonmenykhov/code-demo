import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import DefaultCrud from 'src/common/default-crud.class';
import { Answer } from './entities/answer.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AccessTokenRepresentationFull } from 'src/keycloak/dto/access-token-representation-full.interface';

@Injectable()
export class AnswerService extends DefaultCrud<
  Answer,
  CreateAnswerDto,
  UpdateAnswerDto
> {
  constructor(@InjectDataSource() private datasource: DataSource) {
    super(Answer, datasource);
  }

  async createByUser(
    createDto: CreateAnswerDto,
  ): Promise<CreateAnswerDto & Answer> {
    return this.create({ ...createDto });
  }

  async updateByUser(
    id: number,
    updateDto: UpdateAnswerDto,
  ): Promise<UpdateAnswerDto & { id: number } & Answer> {
    return this.update(id, { ...updateDto });
  }
}
