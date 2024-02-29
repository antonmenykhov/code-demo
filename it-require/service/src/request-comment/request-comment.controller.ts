import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RequestCommentService } from './request-comment.service';
import { CreateRequestCommentDto } from './dto/create-request-comment.dto';
import { UpdateRequestCommentDto } from './dto/update-request-comment.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/keycloak/user-info.decorator';
import { AccessTokenRepresentationFull } from 'src/keycloak/dto/access-token-representation-full.interface';

@Controller('request-comment')
@ApiTags('Комментарии к вопросам заявки')
export class RequestCommentController {
  constructor(private readonly requestCommentService: RequestCommentService) {}

  @Post()
  create(
    @Body() createRequestCommentDto: CreateRequestCommentDto,
    @UserInfo() userInfo: AccessTokenRepresentationFull,
  ) {
    return this.requestCommentService.createByUser(
      createRequestCommentDto,
      userInfo,
    );
  }

  @Get()
  findAll() {
    return this.requestCommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestCommentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequestCommentDto: UpdateRequestCommentDto,
    @UserInfo() userInfo: AccessTokenRepresentationFull,
  ) {
    return this.requestCommentService.updateByUser(
      +id,
      updateRequestCommentDto,
      userInfo,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @UserInfo() userInfo: AccessTokenRepresentationFull,
  ) {
    return this.requestCommentService.removeByUser(+id, userInfo);
  }
}
