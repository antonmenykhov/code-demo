import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';
import { SurveyCompleteion } from './entities/survey-completeion.entity';
import { SurveyPeriodService } from 'src/survey-period/survey-period.service';

@Injectable()
export class SurveyCompleteionService {
  constructor(
    private databaseService: DatabaseService,
    private userService: UserService,
    private surveyPeriodService: SurveyPeriodService,
  ) {}
  private repository =
    this.databaseService.connection.getRepository(SurveyCompleteion);

  async create(userInfo: UserInfoDto) {
    const user = await this.userService.findAll();
    if (!user) {
      throw new HttpException({ error: 'bad user' }, HttpStatus.FORBIDDEN);
    }
    const period = await this.surveyPeriodService.getCurrentPeriods();
    return this.repository.save({
      periodId: period.id,
      userId: userInfo.EmployeeId,
    });
  }
}
