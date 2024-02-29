import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DelegationCommentService } from './delegation-comment.service';
import { CreateDelegationCommentDto } from './dto/create-delegation-comment.dto';
import { UpdateDelegationCommentDto } from './dto/update-delegation-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('delegation-comment')
@ApiTags('Комментарии к поручениям')
export class DelegationCommentController {
  constructor(
    private readonly delegationCommentService: DelegationCommentService,
  ) {}

  @Post('return')
  createAndReturn(@Body() createDelegationCommentDto: CreateDelegationCommentDto) {
    return this.delegationCommentService.createAndReturn(createDelegationCommentDto);
  }

  @Post('need-aproove')
  createAndSetNeedAproove(
    @Body() createDelegationCommentDto: CreateDelegationCommentDto,
  ) {
    return this.delegationCommentService.createAndSetNeedAprooving(
      createDelegationCommentDto,
    );
  }

  @Get()
  findAll() {
    return this.delegationCommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.delegationCommentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDelegationCommentDto: UpdateDelegationCommentDto,
  ) {
    return this.delegationCommentService.update(
      +id,
      updateDelegationCommentDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.delegationCommentService.remove(+id);
  }
}
