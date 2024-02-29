import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { ReorderDto } from 'src/interfaces/reorder.dto';

@Controller('question')
@ApiTags('Вопросы')
@Roles(['ADMINISTRATOR'])
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/reorder/:groupId')
  reorder(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() reorderDto: ReorderDto,
  ) {
    return this.questionService.reorder(groupId, reorderDto);
  }

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
