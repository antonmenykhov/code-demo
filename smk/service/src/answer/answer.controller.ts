import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';
import { UserInfo } from 'src/auth/userInfo.decorator';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Roles } from 'src/auth/roles-auth.decorator';
import { ResponsibleAnswerService } from './responsible-answer.service';
import { RespondentAnswerService } from './respondent-answer.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ViewerAnswerService } from './viewer-answer.service';

@Controller('answer')
@ApiTags('Ответы')
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly responsibleAnswerService: ResponsibleAnswerService,
    private readonly respondentAnswerService: RespondentAnswerService,
    private readonly viewerService: ViewerAnswerService,
  ) {}

  @Roles(['RESPONDENT'])
  @Post()
  create(
    @Body() createAnswerDto: CreateAnswerDto,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.answerService.create(createAnswerDto, userInfo);
  }

  @Roles(['ADMINISTRATOR'])
  @Get()
  findAll() {
    return this.answerService.findAll();
  }

  @Roles(['ADMINISTRATOR', 'MANAGER'])
  @Get(':periodId')
  findByPeriod(@Param('periodId', ParseIntPipe) periodId: number) {
    return this.answerService.findByPeriod(periodId);
  }
  @Roles(['ADMINISTRATOR', 'MANAGER'])
  @Get('/with-actions/:periodId')
  findWithActionsByPeriod(@Param('periodId', ParseIntPipe) periodId: number) {
    return this.answerService.findWithActionsByPeriod(periodId);
  }

  @Roles(['ADMINISTRATOR', 'RESPONDENT'])
  @Patch('/comment/:id')
  updateComment(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateCommentDto,
  ) {
    return this.answerService.updateComment(+id, updateAnswerDto.comment);
  }

  @Roles(['RESPONDENT'])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.answerService.update(+id, updateAnswerDto, userInfo);
  }

  @Roles(['RESPONSIBLE'])
  @Get('/responsible/:periodId')
  responsiblefindByPeriod(
    @Param('periodId', ParseIntPipe) periodId: number,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.responsibleAnswerService.getByPeriod(periodId, userInfo);
  }

  @Roles(['RESPONSIBLE'])
  @Get('/responsible/with-actions/:periodId')
  responsiblefindWithActionsByPeriod(
    @Param('periodId', ParseIntPipe) periodId: number,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.responsibleAnswerService.getWithActionsByPeriod(
      periodId,
      userInfo,
    );
  }

  @Roles(['RESPONDENT'])
  @Get('/respondent/:periodId')
  respondentfindByPeriod(
    @Param('periodId', ParseIntPipe) periodId: number,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.respondentAnswerService.getByPeriod(periodId, userInfo);
  }

  @Roles(['RESPONDENT'])
  @Get('/respondent/with-actions/:periodId')
  respondentActionsfindByPeriod(
    @Param('periodId', ParseIntPipe) periodId: number,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.respondentAnswerService.getByPeriodWithActions(
      periodId,
      userInfo,
    );
  }

  @Roles(['VIEWER'])
  @Get('/viewer/:periodId')
  viewerfindByPeriod(@Param('periodId', ParseIntPipe) periodId: number) {
    return this.viewerService.getAnswersByPeriod(periodId);
  }

  @Roles(['VIEWER'])
  @Get('/viewer/with-actions/:periodId')
  viewerActionsfindByPeriod(@Param('periodId', ParseIntPipe) periodId: number) {
    return this.viewerService.getAnswersWithActionByPeriod(periodId);
  }
}
