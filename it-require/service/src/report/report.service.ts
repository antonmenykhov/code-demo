import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Question } from 'src/question/entities/question.entity';
import { Request } from 'src/request/entities/request.entity';
import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportService {
  constructor(
    @InjectDataSource() private datasource: DataSource,
    private usersService: UsersService,
  ) {}

  private requestRepository = this.datasource.getRepository(Request);
  private questionRepository = this.datasource.getRepository(Question);

  async getReport() {
    const requests = await this.requestRepository.find({
      relations: { stage: true, answers: true },
    });

    return requests.map((request) => ({
      ...request,
      ...this.getQuestionAnswerObject(request),
      userId: this.usersService.users.find((user) => user.id === request.userId)
        ?.lastName,
    }));
  }

  async getAwailibleQuestions() {
    return this.questionRepository
      .createQueryBuilder('question')
      .innerJoin('question.answers', 'answer')
      .innerJoin('answer.request', 'request', 'request.deletedAt IS NULL')
      .leftJoin('request.form', 'form')
      .select([
        'question.text as text',
        'question.id as id',
        'form.name as form_name',
      ])
      .distinct(true)
      .getRawMany();
  }

  private getQuestionAnswerObject(request: Request) {
    const questionAnswerObject: { [key: string]: string } = {};
    request.answers.forEach((answer) => {
      questionAnswerObject[`answer_${answer.questionId}`] = answer.answer;
    });
    return questionAnswerObject;
  }
}
