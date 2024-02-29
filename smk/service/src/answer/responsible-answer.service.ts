import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Answer } from './entities/answer.entity';
import { RawAnswerRowDto } from './dto/raw-answer-row.dto';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';
import { RawAnswerActionDto } from './dto/raw-answer-action.dto';
import { AnswerActionRowDto } from './dto/answer-action-row.dto';

@Injectable()
export class ResponsibleAnswerService {
  constructor(private databaseService: DatabaseService) {}
  private repository = this.databaseService.connection.getRepository(Answer);

  getByPeriod(periodId: number, userInfo: UserInfoDto) {
    return this.repository
      .createQueryBuilder('answer')
      .withDeleted()
      .leftJoin('answer.period', 'period')
      .innerJoin('answer.question', 'question')
      .innerJoin('question.group', 'group')
      .leftJoin('group.responsibles', 'responsible')
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
        `question.text as question`,
        `group.name as group`,
      ])
      .where('period.id=:periodId', { periodId })
      .andWhere('responsible.userId=:employeeId', {
        employeeId: userInfo.EmployeeId,
      })
      .orderBy('group.name')
      .addOrderBy('question.text')
      .getRawMany() as Promise<RawAnswerRowDto[]>;
  }

  async getWithActionsByPeriod(periodId: number, userInfo: UserInfoDto) {
    const rawRows = (await this.repository
      .createQueryBuilder('answer')
      .withDeleted()
      .leftJoin('answer.period', 'period')
      .innerJoin('answer.question', 'question')
      .innerJoin('question.group', 'group')
      .leftJoin('group.responsibles', 'responsible')
      .leftJoin('answer.user', 'user')
      .leftJoin('answer.correctAction', 'action')
      .leftJoin('action.documents', 'document')
      .leftJoin('action.state', 'state')
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
        `question.text as question`,
        `group.name as group`,
        `action.reason as reason`,
        `action.action as action`,
        `action.responsible as responsible`,
        `action.dateFinish as "dateFinish"`,
        `action.factDateFinish as "factDateFinish"`,
        `action.completeComment as "completeComment"`,
        `state.nameForUser as state`,
        `document.path as "documentPath"`,
        `document.fileName as "documentName"`,
      ])
      .where('period.id=:periodId', { periodId })
      .andWhere('responsible.userId=:employeeId', {
        employeeId: userInfo.EmployeeId,
      })
      .andWhere(`answer.comment IS NOT null AND answer.comment != ''`)
      .andWhere('answer.numericVariant != 0 AND answer.numericVariant < 8')
      .orderBy('group.name')
      .addOrderBy('question.text')
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
