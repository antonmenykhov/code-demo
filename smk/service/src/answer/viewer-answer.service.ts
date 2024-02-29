import { Injectable } from '@nestjs/common';
import { AnswerService } from './answer.service';

@Injectable()
export class ViewerAnswerService {
  constructor(private answerService: AnswerService) {}

  async getAnswersByPeriod(periodId: number) {
    return (await this.answerService.findByPeriod(periodId)).map((row) => ({
      ...row,
      userId: undefined,
    }));
  }

  async getAnswersWithActionByPeriod(periodId: number) {
    return (await this.answerService.findWithActionsByPeriod(periodId)).map(
      (row) => ({ ...row, userId: undefined }),
    );
  }
}
