import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ReorderDto } from 'src/interfaces/reorder.dto';
import { CreateQuestionGroupDto } from './dto/create-question-group.dto';
import { UpdateQuestionGroupDto } from './dto/update-question-group.dto';
import { QuestionGroup } from './entities/question-group.entity';
import { ServiceStaffService } from 'src/service-staff/service-staff.service';

@Injectable()
export class QuestionGroupService {
  constructor(
    private databaseSerivce: DatabaseService,
    private serviceStaffSerice: ServiceStaffService,
  ) {}
  private repositrory =
    this.databaseSerivce.connection.getRepository(QuestionGroup);

  async find() {
    const groups = await this.repositrory.find({
      relations: ['responsibles', 'questions'],
      order: { order: 'ASC' },
    });
    return groups;
    //const userInfos = await this.serviceStaffSerice.getEmployeesById(
    //  groups.reduce((acc, group) => {
    //    group.responsibles.forEach((res) => acc.push(res.userId));
    //    return acc;
    //  }, []),
    //);
    //return groups.map((group) => {
    //  const newGroup = {
    //    ...group,
    //    responsibles: group.responsibles.map((res) => {
    //      const userInfo = userInfos.find(
    //        (info) => info.employeeId === res.userId,
    //      );
    //      if (userInfo)
    //        return {
    //          ...res,
    //          userName: userInfo.fullFio,
    //          userEmail: userInfo.email,
    //          tabNumber: userInfo.tabnum,
    //        };
    //    }),
    //  };
    //  return newGroup;
    //});
  }

  async create(createQuestionGroupDto: CreateQuestionGroupDto) {
    return {
      questions: [],
      responsibles: [],
      ...(await this.repositrory.save(createQuestionGroupDto)),
    };
  }

  update(id: number, updateQuestionGroupDto: UpdateQuestionGroupDto) {
    return this.repositrory.save({ id, ...updateQuestionGroupDto });
  }

  remove(id: number) {
    return this.repositrory.softDelete(id);
  }

  async reorder(reorderDto: ReorderDto) {
    const { newOrder, oldOrder } = reorderDto;
    await this.databaseSerivce.connection
      .createQueryBuilder()
      .update(QuestionGroup)
      .set({ order: () => '"order" + 1' })
      .where('order >= :newOrder ', {
        newOrder,
      })
      .execute();
    await this.databaseSerivce.connection
      .createQueryBuilder()
      .update(QuestionGroup)
      .set({ order: newOrder })
      .where('order = :oldOrder ', {
        oldOrder: oldOrder > newOrder ? oldOrder + 1 : oldOrder,
      })
      .execute();

    return this.find();
  }
}
