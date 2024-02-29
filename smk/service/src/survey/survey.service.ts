import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';
import { DatabaseService } from 'src/database/database.service';
import { QuestionGroup } from 'src/question-group/entities/question-group.entity';
import { SurveyCompleteion } from 'src/survey-completeion/entities/survey-completeion.entity';
import { SurveyPeriod } from 'src/survey-period/entities/survey-period.entity';
import { SurveyPeriodService } from 'src/survey-period/survey-period.service';

@Injectable()
export class SurveyService {
  constructor(
    private databaseService: DatabaseService,
    private surveyPeriodService: SurveyPeriodService,
  ) {}
  private questionGroupRepository =
    this.databaseService.connection.getRepository(QuestionGroup);
  private completionRepository =
    this.databaseService.connection.getRepository(SurveyCompleteion);

  async getSurveyForUser(userInfo: UserInfoDto) {
    const currentPeriod = await this.checkActiveSurvey();
    await this.checkSurveyComplition(userInfo, currentPeriod);
    return (
      await this.questionGroupRepository
        .createQueryBuilder('qg')
        .leftJoinAndSelect('qg.responsibles', 'responisble')
        .leftJoinAndSelect('qg.questions', 'question')
        .leftJoinAndSelect(
          'question.answers',
          'answer',
          'answer.userId=:userId AND answer.periodId=:periodId',
          { userId: userInfo.EmployeeId, periodId: currentPeriod.id },
        )
        .orderBy('qg.order', 'ASC')
        .addOrderBy('question.order', 'ASC')
        .getMany()
    ).filter(
      (qg) =>
        !qg.responsibles.find((res) => res.userId === userInfo.EmployeeId),
    );
  }

  async checkActiveSurvey() {
    return await this.surveyPeriodService.getCurrentPeriods();
  }

  async checkSurveyComplition(userInfo: UserInfoDto, period: SurveyPeriod) {
    if (
      (await this.completionRepository.count({
        where: { userId: userInfo.EmployeeId, periodId: period.id },
      })) === 1
    ) {
      throw new HttpException(
        { error: 'Вы уже прошли опрос в этом периоде' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
