import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { DelegationService } from './delegation.service';
import { CreateDelegationDto } from './dto/create-delegation.dto';
import { UpdateDelegationDto } from './dto/update-delegation.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserMapperInterceptor } from 'src/keycloak/userMapping.interceptor';
import { Delegation } from './entities/delegation.entity';
import { UserMapping } from 'src/keycloak/userMapping.decorator';
import { UserInfo } from 'src/users/userInfo.decorator';
import { AccessTokenRepresentationFull } from 'src/keycloak/dto/access-token-representation-full.interface';

@Controller('delegation')
@ApiTags('Поручения')
export class DelegationController {
  constructor(private readonly delegationService: DelegationService) {}

  @Post()
  @UserMapping<Delegation>(['toId', 'fromId'])
  create(@Body() createDelegationDto: CreateDelegationDto) {
    return this.delegationService.create(createDelegationDto);
  }

  @UserMapping<Delegation>(['toId', 'fromId'])
  @Get()
  delegationReport(@UserInfo() userInfo: AccessTokenRepresentationFull) {
    return this.delegationService.getDelegationReport(userInfo);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDelegationDto: UpdateDelegationDto,
  ) {
    return this.delegationService.update(+id, updateDelegationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.delegationService.remove(+id);
  }

  @Post('/readed/:id')
  setReaded(@Param('id', ParseIntPipe) id: number) {
    return this.delegationService.setReaded(id);
  }

  @Post('/aprooved/:id')
  setAprooved(@Param('id', ParseIntPipe) id: number) {
    return this.delegationService.setAprooved(id);
  }
}
