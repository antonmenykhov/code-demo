import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ActionService } from 'src/action/action.service';
import { EmailerService } from 'src/emailer/emailer.service';
import { SurveyPeriodService } from 'src/survey-period/survey-period.service';

@Injectable()
export class ExecuterService {
  constructor(
    private emailerService: EmailerService,
    private surveyPeriosService: SurveyPeriodService,
    private actionsService: ActionService,
  ) {}

  @Cron('0 0 5 * * *')
  async checkTimeAndExecute() {
    try {
      await this.sendInvite();
    } catch (error) {
      console.log(error);
    }
    try {
      console.log('Отправка приглашений');
      await this.sendReportInvite();
    } catch (error) {
      console.log(error);
    }
  }

  async sendInvite() {
    const currentPeriod = await this.surveyPeriosService.getCurrentPeriods();
    if (currentPeriod) {
      const startDate = new Date(currentPeriod.start);
      const finishDate = new Date(currentPeriod.finish);
      const currentDate = new Date();
      const periodLength = this.calcDateDiffInDays(startDate, finishDate);
      if (
        this.calcDateDiffInDays(startDate, currentDate) === 0 ||
        this.calcDateDiffInDays(currentDate, finishDate) === 1 ||
        this.calcDateDiffInDays(startDate, currentDate) ===
          Math.round(periodLength / 2) - 1
      )
        return this.emailerService.sendInvite(currentPeriod.id);

      return periodLength;
    }
  }

  async sendReportInvite() {
    const users = await this.actionsService.getUserWhoNeedsReport();
    return this.emailerService.sendReportNeeded(users);
  }

  private calcDateDiffInDays(dateLess: Date, dateMore: Date) {
    return Math.round(
      Math.abs(
        (this.getDateWithoutTime(dateMore).getTime() -
          this.getDateWithoutTime(dateLess).getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );
  }

  private getDateWithoutTime(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
