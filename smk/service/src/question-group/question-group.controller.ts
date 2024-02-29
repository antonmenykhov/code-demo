import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { QuestionGroupService } from './question-group.service';
import { CreateQuestionGroupDto } from './dto/create-question-group.dto';
import { UpdateQuestionGroupDto } from './dto/update-question-group.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { ReorderDto } from 'src/interfaces/reorder.dto';

@Controller('question-group')
@ApiTags('Группы вопросов')
@Roles(['ADMINISTRATOR'])
export class QuestionGroupController {
  constructor(private readonly questionGroupService: QuestionGroupService) {}

  @Get()
  getQuestionGroupd() {
    return this.questionGroupService.find();
  }

  @Post('/reorder/')
  reorder(@Body() reorderDto: ReorderDto) {
    return this.questionGroupService.reorder(reorderDto);
  }

  @Post()
  create(@Body() createQuestionGroupDto: CreateQuestionGroupDto) {
    return this.questionGroupService.create(createQuestionGroupDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionGroupDto: UpdateQuestionGroupDto,
  ) {
    return this.questionGroupService.update(+id, updateQuestionGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionGroupService.remove(+id);
  }
}
