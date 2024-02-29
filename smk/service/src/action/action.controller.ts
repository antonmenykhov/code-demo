import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { ProlongationDto } from './dto/prolongation.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { UserInfo } from 'src/auth/userInfo.decorator';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';
import { ActionReportDto } from './dto/report.dto';

@ApiTags('Корректирующие действия')
@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Roles(['RESPONSIBLE', 'ADMINISTRATOR', 'MANAGER', 'RESPONDENT'])
  @Get('/:periodId')
  getByPeriod(
    @Param('periodId', ParseIntPipe) periodId: number,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.actionService.getActionsByPeriod(periodId, userInfo);
  }

  @Roles(['RESPONSIBLE', 'ADMINISTRATOR'])
  @Post()
  create(@Body() createDto: CreateActionDto) {
    return this.actionService.create(createDto);
  }

  @Roles(['RESPONSIBLE', 'ADMINISTRATOR'])
  @Patch(':id')
  update(
    @Body() updateDto: UpdateActionDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.actionService.update(updateDto, id);
  }

  @Roles(['ADMINISTRATOR'])
  @Post('/comment/administrator/:id')
  addChecking(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddCommentDto,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.actionService.addCommentAdministrator(id, dto, userInfo);
  }

  @Roles(['MANAGER'])
  @Post('/comment/manager/:id')
  addAprooving(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddCommentDto,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.actionService.addCommentManager(id, dto, userInfo);
  }

  @Roles(['RESPONSIBLE'])
  @Post('/send/:id')
  sendActions(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.actionService.sendAllAction(id, userInfo);
  }

  @Roles(['RESPONSIBLE'])
  @Post('/prolongation/add/:id')
  addProlongation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProlongationDto,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.actionService.addProlongation(dto, id, userInfo);
  }

  @Roles(['MANAGER'])
  @Post('/prolongation/aproove/:id')
  aproovePlongation(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.actionService.aprooveProlongation(id, userInfo);
  }

  @Roles(['RESPONSIBLE', 'ADMINISTRATOR'])
  @Post('/complete/:id')
  addComplete(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActionReportDto,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.actionService.addCompleteon(id, dto, userInfo);
  }

  @Roles(['MANAGER', 'ADMINISTRATOR', 'RESPONSIBLE'])
  @Post('/status/next/:id')
  setNextStauts(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.actionService.setNextState(id, userInfo);
  }

  @Roles(['MANAGER', 'ADMINISTRATOR', 'RESPONSIBLE'])
  @Post('/status/return/:id')
  setReturnStauts(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.actionService.setReturnStatus(id, userInfo);
  }
}
