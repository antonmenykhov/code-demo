import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { DatabaseService } from 'src/database/database.service';
import { Action } from './entities/action.entity';
import { ProlongationDto } from './dto/prolongation.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { ActionStateService } from 'src/action-state/action-state.service';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';
import { ActionProlongationService } from 'src/action-prolongation/action-prolongation.service';
import { Answer } from 'src/answer/entities/answer.entity';
import { EmailerService } from 'src/emailer/emailer.service';
import { ActionReportDto } from './dto/report.dto';
import { ActionHistoryService } from 'src/action-history/action-history.service';

@Injectable()
export class ActionService {
  constructor(
    private databaseService: DatabaseService,
    private actionStateService: ActionStateService,
    private actionProlongationService: ActionProlongationService,
    private emailerService: EmailerService,
    private actionHistoryService: ActionHistoryService,
  ) {}
  private repository = this.databaseService.connection.getRepository(Action);
  create(createActionDto: CreateActionDto) {
    return this.repository.save({ ...createActionDto, stateId: 1 });
  }

  update(updateActionDro: UpdateActionDto, id: number) {
    return this.repository.save({ ...updateActionDro, id });
  }

  async addProlongation(
    prolongation: ProlongationDto,
    id: number,
    userInfo: UserInfoDto,
  ) {
    this.actionHistoryService.create({
      actionId: id,
      event: `Запросил продление на ${this.getFormatedDate(
        prolongation.date,
      )} по причине ${prolongation.reason}`,
      userId: userInfo.EmployeeId,
    });
    const state = await this.actionStateService.getProlongationState();
    await this.actionProlongationService.create(
      prolongation.date,
      prolongation.reason,
      id,
    );
    return this.repository.save({ id, state });
  }

  async aprooveProlongation(id: number, userInfo: UserInfoDto) {
    const action = await this.repository.findOneOrFail({
      where: { id },
      relations: ['prolongations'],
    });
    const currentState = await this.actionStateService.getOne(action.stateId);
    const lastProlongation = action.prolongations
      .filter((prolongation) => prolongation.aprooved === false)
      .sort((a, b) => b.id - a.id)[0];
    if (!lastProlongation)
      throw new HttpException(
        { error: 'Нет запросов на продление' },
        HttpStatus.BAD_REQUEST,
      );
    await this.actionProlongationService.aproove(lastProlongation.id);
    action.dateFinish = lastProlongation.date;
    action.stateId = currentState.nextStateId;
    this.actionHistoryService.create({
      actionId: id,
      event: `Утвердил продление на ${this.getFormatedDate(
        lastProlongation.date,
      )} по причине ${lastProlongation.reason}`,
      userId: userInfo.EmployeeId,
    });
    return this.repository.save(action);
  }

  addCommentAdministrator(
    id: number,
    addCommentChecked: AddCommentDto,
    userInfo: UserInfoDto,
  ) {
    this.actionHistoryService.create({
      actionId: id,
      event: `Оставил комментарий: ${addCommentChecked.comment}`,
      userId: userInfo.EmployeeId,
    });
    return this.repository.save({
      id,
      administratorComment: addCommentChecked.comment,
    });
  }

  addCommentManager(
    id: number,
    addCommentChecked: AddCommentDto,
    userInfo: UserInfoDto,
  ) {
    this.actionHistoryService.create({
      actionId: id,
      event: `Оставил комментарий: ${addCommentChecked.comment}`,
      userId: userInfo.EmployeeId,
    });
    return this.repository.save({
      id,
      managerComment: addCommentChecked.comment,
    });
  }

  async addCompleteon(
    id: number,
    addComplete: ActionReportDto,
    userInfo: UserInfoDto,
  ) {
    const item = await this.repository.findOne(id, { relations: ['answer'] });
    const currentState = await this.actionStateService.getOne(item.stateId);
    let nextStateId = currentState.id;
    if (
      !currentState.isReturnedState &&
      currentState.whoCanChangeState === 'RESPONSIBLE'
    ) {
      nextStateId = currentState.nextStateId;
    }
    const departmentName = (
      await this.repository
        .createQueryBuilder('action')
        .leftJoin('action.answer', 'answer')
        .leftJoin('answer.question', 'question')
        .leftJoin('question.group', 'group')
        .select('group.name as name')
        .where('action.id=:id', { id })
        .getRawOne()
    ).name as string;
    this.emailerService.sendReport(
      departmentName,
      item.answer.periodId,
      item.answerId,
    );
    this.actionHistoryService.create({
      actionId: id,
      event: `Добавил\\изменил отчет о КД с комментарием: ${addComplete.comment}`,
      userId: userInfo.EmployeeId,
    });
    return this.repository.save({
      id,
      completeComment: addComplete.comment,
      factDateFinish: addComplete.date || new Date(),
      stateId: nextStateId,
    });
  }

  async setNextState(id: number, userInfo: UserInfoDto) {
    const item = await this.repository.findOne(id, { relations: ['answer'] });
    const currentState = await this.actionStateService.getOne(item.stateId);
    const nextState = await this.actionStateService.getOne(
      currentState.nextStateId,
    );
    if (
      currentState &&
      currentState.nextStateId &&
      userInfo.roles.includes(currentState.whoCanChangeState)
    ) {
      if (currentState.isReturnedState) {
        const departmentName = (
          await this.repository
            .createQueryBuilder('action')
            .leftJoin('action.answer', 'answer')
            .leftJoin('answer.question', 'question')
            .leftJoin('question.group', 'group')
            .select('group.name as name')
            .where('action.id=:id', { id })
            .getRawOne()
        ).name as string;
        this.emailerService.sendReturningJob(
          departmentName,
          item.answer.periodId,
          item.answerId,
        );
      }

      this.actionHistoryService.create({
        actionId: id,
        event: `Изменил статус с : ${currentState.name} на ${nextState.name}`,
        userId: userInfo.EmployeeId,
      });

      return this.repository.save({
        ...item,
        stateId: currentState.nextStateId,
      });
    }
    return null;
  }

  async setReturnStatus(id: number, userInfo: UserInfoDto) {
    const item = await this.repository.findOne(id);
    const currentState = await this.actionStateService.getOne(item.stateId);
    if (
      currentState &&
      currentState.returnStateId &&
      userInfo.roles.includes(currentState.whoCanChangeState)
    ) {
      const nextState = await this.actionStateService.getOne(
        currentState.nextStateId,
      );
      this.actionHistoryService.create({
        actionId: id,
        event: `Изменил статус с : ${currentState.name} на ${nextState.name}`,
        userId: userInfo.EmployeeId,
      });
      return this.repository.save({
        ...item,
        stateId: currentState.returnStateId,
      });
    }
    return null;
  }

  async sendAllAction(periodId: number, useInfo: UserInfoDto) {
    const actions = await this.repository
      .createQueryBuilder('action')
      .innerJoin('action.answer', 'answer', 'answer.periodId=:periodId', {
        periodId,
      })
      .innerJoin('answer.question', 'question')
      .innerJoin('question.group', 'group')
      .innerJoin('group.responsibles', 'resp', 'resp.userId=:userId', {
        userId: useInfo.EmployeeId,
      })
      .where('action.stateId=1')
      .getMany();
    const departmentName = (
      await this.repository
        .createQueryBuilder('action')
        .leftJoin('action.answer', 'answer')
        .leftJoin('answer.question', 'question')
        .leftJoin('question.group', 'group')
        .select('group.name as name')
        .where('action.id=:id', { id: actions[0].id })
        .getRawOne()
    ).name as string;
    await this.emailerService.sendActions(departmentName, periodId);
    return this.repository.save(
      actions.map((action) => ({ ...action, stateId: action.stateId + 2 })),
    );
  }

  async getAllActionsByPeriod(periodId: number) {
    return (
      await this.databaseService.connection
        .getRepository(Answer)
        .createQueryBuilder('answer')
        .withDeleted()
        .leftJoin('answer.period', 'period')
        .innerJoinAndSelect('answer.question', 'question')
        .innerJoinAndSelect('question.group', 'group')
        .leftJoinAndSelect('answer.user', 'user')
        .leftJoinAndSelect('answer.correctAction', 'action')
        .leftJoinAndSelect('action.state', 'state')
        .leftJoinAndSelect('action.prolongations', 'prolongation')
        .leftJoinAndSelect('action.documents', 'documents')
        .innerJoin(
          'user.completions',
          'completion',
          'completion.periodId=:periodId',
          { periodId },
        )
        .where('period.id=:periodId', { periodId })
        .andWhere(`answer.comment IS NOT null AND answer.comment != ''`)
        .andWhere('answer.numericVariant != 0 AND answer.numericVariant < 8')
        .orderBy('group.name')
        .addOrderBy('question.text')
        .getMany()
    ).map((answer) => {
      const answerActionUnion: Action &
        Answer & {
          groupText: string;
          questionText: string;
          stateText: string;
        } = {
        ...answer.correctAction,
        ...answer,
        groupText: answer.question.group.name,
        questionText: answer.question.text,
        stateText: answer?.correctAction?.state?.name || 'Не создано',
      };
      return answerActionUnion;
    });
  }

  async getMyActionsByPeriod(periodId: number, userInfo: UserInfoDto) {
    return (
      await this.databaseService.connection
        .getRepository(Answer)
        .createQueryBuilder('answer')
        .withDeleted()
        .leftJoin('answer.period', 'period')
        .innerJoinAndSelect('answer.question', 'question')
        .innerJoinAndSelect('question.group', 'group')
        .innerJoinAndSelect(
          'group.responsibles',
          'responsible',
          'responsible.userId=:userId',
          { userId: userInfo.EmployeeId },
        )
        .leftJoinAndSelect('answer.correctAction', 'action')
        .leftJoinAndSelect('action.state', 'state')
        .leftJoinAndSelect('action.prolongations', 'prolongation')
        .leftJoinAndSelect('action.documents', 'documents')
        .leftJoin('answer.user', 'user')
        .innerJoin(
          'user.completions',
          'completion',
          'completion.periodId=:periodId',
          { periodId },
        )
        .where('period.id=:periodId AND period.resultsSended IS true', {
          periodId,
        })
        .andWhere(`answer.comment IS NOT null AND answer.comment != ''`)
        .andWhere('answer.numericVariant != 0 AND answer.numericVariant < 8')
        .orderBy('group.name')
        .addOrderBy('question.text')
        .getMany()
    ).map((answer) => {
      const answerActionUnion: Action &
        Answer & {
          groupText: string;
          questionText: string;
          stateText: string;
        } = {
        ...answer.correctAction,
        ...answer,
        groupText: answer.question.group.name,
        questionText: answer.question.text,
        stateText: answer?.correctAction?.state?.nameForUser || 'КД не создано',
        userId: '',
        managerComment: '',
        correctAction: answer.correctAction
          ? {
              ...answer.correctAction,
              managerComment: '',
              state: { ...answer.correctAction.state, name: '' },
            }
          : (undefined as Action),
        state: answer.correctAction?.state
          ? { ...answer.correctAction.state, name: '' }
          : undefined,
      };
      return answerActionUnion;
    });
  }

  async getActionsByPeriod(periodId: number, userInfo: UserInfoDto) {
    if (
      userInfo.roles.includes('ADMINISTRATOR') ||
      userInfo.roles.includes('MANAGER')
    ) {
      return await this.getAllActionsByPeriod(periodId);
    }
    if (userInfo.roles.includes('RESPONSIBLE')) {
      return await this.getMyActionsByPeriod(periodId, userInfo);
    }
    return [];
  }

  async getUserWhoNeedsReport() {
    const now = new Date();
    return (
      await this.repository
        .createQueryBuilder('action')
        .where(
          'action.completeComment IS NULL AND EXTRACT(YEAR from action.dateFinish)=:year AND EXTRACT(MONTH from action.dateFinish)=:month AND EXTRACT(DAY from action.dateFinish)=:day',
          {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate() + 1,
          },
        )
        .leftJoin('action.answer', 'answer')
        .leftJoin('answer.question', 'question')
        .leftJoin('question.group', 'group')
        .leftJoin('group.responsibles', 'responsible')
        .select('responsible.userId as "userId"')
        .groupBy('responsible.userId')
        .getRawMany()
    ).map((emp: { userId: string }) => emp.userId);
  }

  private getFormatedDate(rawDate: string | Date) {
    return new Date(rawDate).toLocaleDateString('ru-RU');
  }
}
