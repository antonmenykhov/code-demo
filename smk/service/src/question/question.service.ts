import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ReorderDto } from 'src/interfaces/reorder.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(private databaseSerivce: DatabaseService) {}
  private repository = this.databaseSerivce.connection.getRepository(Question);
  async create(createQuestionDto: CreateQuestionDto) {
    return { variants: [], ...(await this.repository.save(createQuestionDto)) };
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return this.repository.save({ id, ...updateQuestionDto });
  }

  remove(id: number) {
    return this.repository.softDelete(id);
  }

  async reorder(groupId: number, reorderDto: ReorderDto) {
    const { newOrder, oldOrder } = reorderDto;
    await this.databaseSerivce.connection
      .createQueryBuilder()
      .update(Question)
      .set({ order: () => '"order" + 1' })
      .where('order >= :newOrder AND groupId = :groupId', {
        newOrder,
        groupId,
      })
      .execute();
    await this.databaseSerivce.connection
      .createQueryBuilder()
      .update(Question)
      .set({ order: newOrder })
      .where('order = :oldOrder AND groupId = :groupId', {
        oldOrder: oldOrder > newOrder ? oldOrder + 1 : oldOrder,
        groupId,
      })
      .execute();

    return this.repository
      .createQueryBuilder('question')
      .where('question.groupId=:groupId', { groupId })
      .getMany();
  }
}
