import { Injectable } from '@nestjs/common';
import { CreateDelegationDto } from './dto/create-delegation.dto';
import { UpdateDelegationDto } from './dto/update-delegation.dto';
import { DefaultCrud } from 'src/classes/default-crud.class';
import { Delegation } from './entities/delegation.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, IsNull } from 'typeorm';
import { AccessTokenRepresentationFull } from 'src/keycloak/dto/access-token-representation-full.interface';

@Injectable()
export class DelegationService extends DefaultCrud<
  Delegation,
  CreateDelegationDto,
  UpdateDelegationDto
> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Delegation, dataSource);
  }

  async setReaded(id: number) {
    return this.update(id, { isReaded: true });
  }

  async setAprooved(id: number) {
    await this.update(id, { isAprooved: true, isActive: false });
    const delegation = await this.findOne(id);
    if (delegation.parentId) {
      return this.setNeedAprooved(delegation.parentId);
    }
    return 'Ок';
  }

  async setNeedAprooved(id: number) {
    return this.update(id, { isNeedAprooving: true });
  }

  async getDelegationsByDocumentId(documentId: number) {
    return this.dataSource
      .getRepository(Delegation)
      .find({ where: { documentId }, order: { id: 'ASC' } });
  }

  async getDelegationReport(userInfo: AccessTokenRepresentationFull) {
    return this.dataSource
      .getRepository(Delegation)
      .createQueryBuilder('delegation')
      .innerJoinAndSelect(
        'delegation.document',
        'document',
        'document.deleted IS NULL',
      )
      .where('delegation.toId=:userId OR delegation.fromId=:userId', {
        userId: userInfo.sub,
      })
      .getMany();
  }
}
