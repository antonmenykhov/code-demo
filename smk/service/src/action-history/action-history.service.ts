import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ActionHistory } from './entities/action-history.enity';
import { CreateActionHistoryDto } from './dto/create-action-history.dto';

@Injectable()
export class ActionHistoryService {
  constructor(private databaseSerivce: DatabaseService) {}

  private repository =
    this.databaseSerivce.connection.getRepository(ActionHistory);

  async findByAction(id: number) {
    return this.repository.find({
      where: { actionId: id },
      order: { date: 'ASC' },
    });
  }

  async create(createActionHistoryDto: CreateActionHistoryDto) {
    return this.repository.save(createActionHistoryDto);
  }
}
