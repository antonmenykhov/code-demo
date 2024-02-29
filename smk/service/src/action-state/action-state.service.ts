import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ActionState } from './entities/action-state.entity';

@Injectable()
export class ActionStateService implements OnModuleInit {
  constructor(private databaseSerive: DatabaseService) {}
  private repository =
    this.databaseSerive.connection.getRepository(ActionState);

  onModuleInit() {
    this.fill();
  }
  async fill() {
    const actionStates: ActionState[] = [
      {
        id: 1,
        name: 'Новое',
        nameForUser: 'Новое',
        kdOpened: true,
        prolongationOpened: false,
        reportOpened: false,
        whoCanChangeState: 'RESPONSIBLE',
        nextStateId: 3,
      },
      {
        id: 2,
        name: 'Отправлено на доработку',
        nameForUser: 'На доработке',
        kdOpened: true,
        prolongationOpened: false,
        reportOpened: false,
        whoCanChangeState: 'RESPONSIBLE',
        nextStateId: 3,
        isReturnedState: true,
      },
      {
        id: 3,
        name: 'Отправлено на согласование',
        nameForUser: 'Отправлено на согласование',
        whoCanChangeState: 'ADMINISTRATOR',
        kdOpened: false,
        reportOpened: false,
        prolongationOpened: false,
        nextStateId: 4,
        returnStateId: 2,
      },
      {
        id: 4,
        name: 'Проверено',
        nameForUser: 'Отправлено на согласование',
        whoCanChangeState: 'MANAGER',
        kdOpened: false,
        reportOpened: false,
        prolongationOpened: false,
        nextStateId: 5,
        returnStateId: 2,
      },
      {
        id: 5,
        name: 'Согласовано ОСТРиМК',
        nameForUser: 'Согласовано ОСТРиМК',
        whoCanChangeState: 'ADMINISTRATOR',
        kdOpened: false,
        reportOpened: false,
        prolongationOpened: false,
        nextStateId: 6,
        returnStateId: 2,
      },
      {
        id: 6,
        name: 'Согласовано ГД',
        nameForUser: 'Согласовано ГД',
        kdOpened: false,
        prolongationOpened: true,
        reportOpened: true,
        whoCanChangeState: 'RESPONSIBLE',
        nextStateId: 8,
      },
      {
        id: 7,
        name: 'Отправлено на доработку Отчета',
        nameForUser: 'Отчет На доработке',
        reportOpened: true,
        prolongationOpened: false,
        kdOpened: false,
        whoCanChangeState: 'RESPONSIBLE',
        nextStateId: 8,
        isReturnedState: true,
      },
      {
        id: 8,
        name: 'Отчет На согласовании',
        nameForUser: 'Отчет На согласовании',
        whoCanChangeState: 'ADMINISTRATOR',
        kdOpened: false,
        prolongationOpened: true,
        reportOpened: false,
        returnStateId: 7,
        nextStateId: 9,
      },
      {
        id: 9,
        name: 'Отчет проверен',
        nameForUser: 'Отчет На согласовании',
        whoCanChangeState: 'MANAGER',
        kdOpened: false,
        prolongationOpened: true,
        reportOpened: false,
        returnStateId: 7,
        nextStateId: 10,
      },
      {
        id: 10,
        name: 'Отчет Согласован ОСТРиМК',
        nameForUser: 'Отчет Согласован ОСТРиМК',
        whoCanChangeState: 'ADMINISTRATOR',
        kdOpened: false,
        prolongationOpened: true,
        reportOpened: false,
        returnStateId: 7,
        nextStateId: 11,
      },
      {
        id: 11,
        name: 'Отчет Согласован ГД',
        nameForUser: 'Отчет Согласован ГД',
        whoCanChangeState: 'NOBODY',
        kdOpened: false,
        prolongationOpened: true,
        reportOpened: false,
      },
      {
        id: 12,
        name: 'Запрос на продление срока',
        nameForUser: 'Продление срока на согласовании',
        whoCanChangeState: 'MANAGER',
        kdOpened: false,
        prolongationOpened: false,
        reportOpened: false,
        returnStateId: 6,
        nextStateId: 6,
        isProlongationState: true,
      },
    ];
    this.repository.save(actionStates);
  }

  async getOne(id: number) {
    return await this.repository.findOne(id);
  }

  async getProlongationState() {
    return await this.repository.findOne({ isProlongationState: true });
  }
}
