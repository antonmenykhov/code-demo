import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import DefaultCrud from 'src/common/default-crud.class';
import { Question } from './entities/question.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class QuestionService extends DefaultCrud<
  Question,
  CreateQuestionDto,
  UpdateQuestionDto
> {
  constructor(@InjectDataSource() private datasource: DataSource) {
    super(Question, datasource);
  }
  private treeRepository = this.datasource.manager.getTreeRepository(Question);

  async create(
    createDto: CreateQuestionDto,
  ): Promise<CreateQuestionDto & Question> {
    const parentQuestion = createDto.parentId
      ? await this.repository.findOne({ where: { id: createDto.parentId } })
      : undefined;

    return this.repository.save({
      ...createDto,
      parentId: undefined,
      parent: parentQuestion,
    });
  }

  async update(
    id: number,
    updateDto: UpdateQuestionDto,
  ): Promise<UpdateQuestionDto & { id: number } & Question> {
    const parentQuestion = updateDto.parentId
      ? await this.repository.findOne({ where: { id: updateDto.parentId } })
      : undefined;

    return this.repository.save({
      ...updateDto,
      id,
      parentId: undefined,
      parent: parentQuestion,
    });
  }

  async findOne(id: number): Promise<Question> {
    const parent = await this.treeRepository.findOne({ where: { id } });
    return this.treeRepository.findDescendantsTree(parent);
  }
}
