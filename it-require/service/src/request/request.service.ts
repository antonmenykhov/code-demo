import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import DefaultCrud from 'src/common/default-crud.class';
import { Request } from './entities/request.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AccessTokenRepresentationFull } from 'src/keycloak/dto/access-token-representation-full.interface';
import { RequestStageService } from 'src/request-stage/request-stage.service';

@Injectable()
export class RequestService extends DefaultCrud<
  Request,
  CreateRequestDto,
  UpdateRequestDto
> {
  constructor(
    @InjectDataSource() private datasoure: DataSource,
    private requestStageService: RequestStageService,
  ) {
    super(Request, datasoure);
  }

  async createRequest(
    createDto: CreateRequestDto,
    userInfo: AccessTokenRepresentationFull,
  ) {
    const initalStage = await this.requestStageService.findInitalRequest();
    if (!initalStage)
      throw new BadRequestException({
        error: 'Не найдена инициирующая стадия',
      });
    return this.create({
      ...createDto,
      userId: userInfo.sub,
      stageId: initalStage.id,
    });
  }

  findMyOne(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: { answers: true, form: true, stage: true, comments: true },
    });
  }

  findMyAll(userInfo: AccessTokenRepresentationFull): Promise<Request[]> {
    return this.repository.find({
      relations: { form: true, stage: true },
      where: { userId: userInfo.sub },
    });
  }

  findAll(): Promise<Request[]> {
    return this.repository.find({ relations: { stage: true, form: true } });
  }

  findOne(id: number): Promise<Request> {
    return this.repository.findOne({
      where: { id },
      relations: { form: true, stage: true },
    });
  }

  async setNextStage(id: number, userInfo: AccessTokenRepresentationFull) {
    const request = await this.findOne(id);
    this.checkUserCanMoveRequestStage(request, userInfo);
    if (!request.stage.nextStageId) return;
    return this.update(id, { stageId: request.stage.nextStageId });
  }

  async setPreviousStage(id: number, userInfo: AccessTokenRepresentationFull) {
    const request = await this.findOne(id);
    this.checkUserCanMoveRequestStage(request, userInfo);
    if (!request.stage.previousStageId) return;
    return this.update(id, { stageId: request.stage.previousStageId });
  }

  private clientName = process.env.KEYCLOAK_REALM_CLIENT_NAME;
  checkUserCanMoveRequestStage(
    request: Request,
    userInfo: AccessTokenRepresentationFull,
  ) {
    const roles = userInfo.resource_access?.[this.clientName]?.roles || [];
    if (!request.stage.roleId) return true;
    if (roles.includes(request.stage.roleId)) return true;
    throw new BadRequestException();
  }
}
