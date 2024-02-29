import { Injectable } from '@nestjs/common';
import { CreateDelegationCommentDto } from './dto/create-delegation-comment.dto';
import { UpdateDelegationCommentDto } from './dto/update-delegation-comment.dto';
import { DefaultCrud } from 'src/classes/default-crud.class';
import { DelegationComment } from './entities/delegation-comment.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DelegationService } from 'src/delegation/delegation.service';

@Injectable()
export class DelegationCommentService extends DefaultCrud<
  DelegationComment,
  CreateDelegationCommentDto,
  UpdateDelegationCommentDto
> {
  constructor(
    @InjectDataSource() private datasource: DataSource,
    private delegationService: DelegationService,
  ) {
    super(DelegationComment, datasource);
  }

  async createAndSetNeedAprooving(createDto: CreateDelegationCommentDto) {
    await this.create(createDto);
    return this.delegationService.setNeedAprooved(createDto.delegationId);
  }

  async createAndReturn(createDto: CreateDelegationCommentDto) {
    await this.create(createDto);
    return this.delegationService.update(createDto.delegationId, {
      isAprooved: false,
      isNeedAprooving: false,
      isReaded: false,
      isActive: true,
    });
  }
}
