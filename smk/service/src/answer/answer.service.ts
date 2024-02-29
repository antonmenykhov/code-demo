import { Injectable } from '@nestjs/common';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answer } from './entities/answer.entity';
import { SurveyPeriodService } from 'src/survey-period/survey-period.service';
import { RawAnswerRowDto } from './dto/raw-answer-row.dto';
import { RawAnswerActionDto } from './dto/raw-answer-action.dto';
import { AnswerActionRowDto } from './dto/answer-action-row.dto';

@Injectable()
export class AnswerService {
  constructor(
    private databaseService: DatabaseService,
    private surveyPeriodService: SurveyPeriodService,
  ) {}
  private repository = this.databaseService.connection.getRepository(Answer);
  async create(createAnswerDto: CreateAnswerDto, userInfo: UserInfoDto) {
    const currentPeriod = await this.surveyPeriodService.getCurrentPeriods();
    const existed = await this.findByUserAndQuestion(
      userInfo.EmployeeId,
      createAnswerDto.question.id,
      currentPeriod.id,
    );
    return this.repository.save({
      id: existed ? existed.id : undefined,
      ...createAnswerDto,
      userId: userInfo.EmployeeId,
      period: currentPeriod,
    });
  }

  findAll() {
    return this.repository.find();
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto, userInfo: UserInfoDto) {
    return this.repository.save({
      id,
      ...updateAnswerDto,
      userId: userInfo.EmployeeId,
    });
  }

  updateComment(id: number, comment: string) {
    return this.repository.save({ id, comment });
  }

  findByUserAndQuestion(userId: string, questionId: number, periodId: number) {
    return this.repository.findOne({ where: { userId, questionId, periodId } });
  }

  findByPeriod(periodId: number) {
    return this.repository
      .createQueryBuilder('answer')
      .withDeleted()
      .leftJoin('answer.period', 'period')
      .innerJoin('answer.question', 'question')
      .innerJoin('question.group', 'group')
      .leftJoin('answer.user', 'user')
      .innerJoin(
        'user.completions',
        'completion',
        'completion.periodId=:periodId',
        { periodId },
      )
      .select([
        `answer.id as id`,
        `answer.numericVariant as "numericVariant"`,
        `answer.comment as comment`,
        `answer.userId as "userId"`,
        `question.text as question`,
        `group.name as group`,
      ])
      .where('period.id=:periodId', { periodId })
      .getRawMany() as Promise<RawAnswerRowDto[]>;
  }

  async findWithActionsByPeriod(periodId: number) {
    const rawRows = (await this.repository
      .createQueryBuilder('answer')
      .withDeleted()
      .leftJoin('answer.period', 'period')
      .innerJoin('answer.question', 'question')
      .innerJoin('question.group', 'group')
      .leftJoin('answer.user', 'user')
      .innerJoin(
        'user.completions',
        'completion',
        'completion.periodId=:periodId',
        { periodId },
      )
      .leftJoin('answer.correctAction', 'action')
      .leftJoin('action.documents', 'document')
      .leftJoin('action.state', 'state')
      .select([
        `answer.id as id`,
        `answer.numericVariant as "numericVariant"`,
        `answer.comment as comment`,
        `answer.userId as "userId"`,
        `question.text as question`,
        `group.name as group`,
        `action.reason as reason`,
        `action.action as action`,
        `action.responsible as responsible`,
        `action.dateFinish as "dateFinish"`,
        `action.completeComment as "completeComment"`,
        `action.factDateFinish as "factDateFinish"`,
        `state.nameForUser as state`,
        `document.path as "documentPath"`,
        `document.fileName as "documentName"`,
      ])
      .where('period.id=:periodId', { periodId })
      .andWhere(`answer.comment IS NOT null AND answer.comment != ''`)
      .andWhere('answer.numericVariant != 0 AND answer.numericVariant < 8')
      .getRawMany()) as RawAnswerActionDto[];

    const reportRows: AnswerActionRowDto[] = [];
    rawRows.forEach((rawRow) => {
      const existReportRowIndex = reportRows.findIndex(
        (reportRow) => reportRow.id === rawRow.id,
      );
      if (existReportRowIndex === -1) {
        reportRows.push({
          ...rawRow,
          docs:
            rawRow.documentName && rawRow.documentPath
              ? [{ name: rawRow.documentName, path: rawRow.documentPath }]
              : [],
          documentName: undefined,
          documentPath: undefined,
        });
      } else {
        if (rawRow.documentName && rawRow.documentPath)
          reportRows[existReportRowIndex].docs.push({
            name: rawRow.documentName,
            path: rawRow.documentPath,
          });
      }
    });

    return reportRows;
  }
}
