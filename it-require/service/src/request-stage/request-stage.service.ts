import { Injectable } from '@nestjs/common';
import { CreateRequestStageDto } from './dto/create-request-stage.dto';
import { UpdateRequestStageDto } from './dto/update-request-stage.dto';
import DefaultCrud from 'src/common/default-crud.class';
import { RequestStage } from './entities/request-stage.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class RequestStageService extends DefaultCrud<
  RequestStage,
  CreateRequestStageDto,
  UpdateRequestStageDto
> {
  constructor(@InjectDataSource() private datasource: DataSource) {
    super(RequestStage, datasource);
  }

  findInitalRequest() {
    return this.repository.findOne({ where: { initialStage: true } });
  }
}
