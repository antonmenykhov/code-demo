import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateRequestCommentDto } from './dto/create-request-comment.dto';
import { UpdateRequestCommentDto } from './dto/update-request-comment.dto';
import DefaultCrud from 'src/common/default-crud.class';
import { RequestComment } from './entities/request-comment.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AccessTokenRepresentationFull } from 'src/keycloak/dto/access-token-representation-full.interface';

@Injectable()
export class RequestCommentService extends DefaultCrud<
  RequestComment,
  CreateRequestCommentDto,
  UpdateRequestCommentDto
> {
  constructor(@InjectDataSource() private datasource: DataSource) {
    super(RequestComment, datasource);
  }

  async createByUser(
    createDto: CreateRequestCommentDto,
    userInfo: AccessTokenRepresentationFull,
  ) {
    return this.create({ ...createDto, userId: userInfo.sub });
  }

  async updateByUser(
    id: number,
    updateDto: UpdateRequestCommentDto,
    userInfo: AccessTokenRepresentationFull,
  ) {
    await this.checkIsUserComment(id, userInfo);
    return this.update(id, { ...updateDto, userId: userInfo.sub });
  }

  async removeByUser(id: number, userInfo: AccessTokenRepresentationFull) {
    await this.checkIsUserComment(id, userInfo);
    return this.remove(id);
  }

  async checkIsUserComment(
    id: number,
    userInfo: AccessTokenRepresentationFull,
  ) {
    const comment = await this.findOne(id);
    if (comment.userId !== userInfo.sub) throw new ForbiddenException();
    return;
  }
}
