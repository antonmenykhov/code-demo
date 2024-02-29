import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ActionProlongation } from './entities/acrion-prolongation.entity';

@Injectable()
export class ActionProlongationService {
  constructor(private databaseService: DatabaseService) {}
  private repository =
    this.databaseService.connection.getRepository(ActionProlongation);

  async create(date: Date, reason: string, actionId: number) {
    return this.repository.save({ date, reason, actionId });
  }

  async aproove(id: number) {
    return this.repository.save({ id, aprooved: true });
  }
}
