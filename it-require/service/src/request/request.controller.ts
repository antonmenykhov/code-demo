import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { UserInfo } from 'src/keycloak/user-info.decorator';
import { AccessTokenRepresentationFull } from 'src/keycloak/dto/access-token-representation-full.interface';
import { ApiTags } from '@nestjs/swagger';

@Controller('request')
@ApiTags('Заявки')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  create(
    @Body() createRequestDto: CreateRequestDto,
    @UserInfo() userInfo: AccessTokenRepresentationFull,
  ) {
    return this.requestService.createRequest(createRequestDto, userInfo);
  }

  @Get()
  findAllMy(@UserInfo() userInfo: AccessTokenRepresentationFull) {
    return this.requestService.findMyAll(userInfo);
  }

  @Get('/all')
  findAll() {
    return this.requestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findMyOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(+id, updateRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(+id);
  }

  @Post('/stage/:id')
  setNextStage(
    @Param('id') id: string,
    @UserInfo() userInfo: AccessTokenRepresentationFull,
  ) {
    return this.requestService.setNextStage(+id, userInfo);
  }

  @Delete('/stage/:id')
  setPreviousStage(
    @Param('id') id: string,
    @UserInfo() userInfo: AccessTokenRepresentationFull,
  ) {
    return this.requestService.setPreviousStage(+id, userInfo);
  }
}
