import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SurveyPeriodService } from 'src/survey-period/survey-period.service';
import { Email } from './entities/email.entity';
import { SendResultsDto } from './dto/send-results-dto';
import axios from 'axios';
import { ResponsibleService } from 'src/responsible/responsible.service';
import { sendResultTemplate } from './templates/send-result-template';
import { DateUtil } from './date.util';
import { inviteTemplate } from './templates/invite-template';
import { UserService } from 'src/user/user.service';
import { ServiceStaffService } from 'src/service-staff/service-staff.service';
import { reportSendedTemplate } from './templates/report-sended-template';
import { returnTemplate } from './templates/return-template';
import { actionSendedTemplate } from './templates/action-sended-template';
import { SurveyCompleteion } from 'src/survey-completeion/entities/survey-completeion.entity';
import { reportNeeded } from './templates/report-needed.template';
import { returnJobRecieved } from './templates/return-job-recieved.template';
import { SendReturnDto } from './templates/send-return.dto';
import { QuestionGroup } from 'src/question-group/entities/question-group.entity';

@Injectable()
export class EmailerService {
  constructor(
    private databaseSerive: DatabaseService,
    private surveyPeriodService: SurveyPeriodService,
    private responsibleService: ResponsibleService,
    private userService: UserService,
    private serviceStaffService: ServiceStaffService,
  ) {}
  private repository = this.databaseSerive.connection.getRepository(Email);
  private emailerUrl = process.env.EMAILER_URL;
  private surveyUrl = process.env.SURVEY_URL.split('&').join('#');
  private manifestUrl = process.env.MANIFEST_URL;
  private myActionsUrl = process.env.REPORT_ACTIONS_URL.split('&').join('#');
  private actionsUrl = process.env.ACTIONS_URL.split('&').join('#');
  async sendResults(sendResultsDto: SendResultsDto) {
    const period = await this.surveyPeriodService.findOne(
      sendResultsDto.periodId,
    );

    const responsibles =
      await this.responsibleService.findAllResponsibleWithInfo();
    for await (const responsible of responsibles) {
      const text = sendResultTemplate(
        responsible.firstName,
        responsible.secondName,
        new DateUtil(period.start).getFormatedDate(),
        new DateUtil(period.finish).getFormatedDate(),
        period.periodName,
        new DateUtil(sendResultsDto.dateInput).getFormatedDate(),
        `${this.actionsUrl}?periodId=${period.id}`,
        new DateUtil(sendResultsDto.dateQuestions).getFormatedDate(),
      );
      await this.sendEmail(
        `Результаты опроса СМК за ${period.periodName}`,
        text,
        [responsible.email],
      );
      await this.repository.save({ text });
    }
    await this.surveyPeriodService.setSended(sendResultsDto);
    return { period, sendResultsDto, responsibles };
  }

  async sendInvite(periodId: number) {
    const completeonsInPeriod = await this.databaseSerive.connection
      .getRepository(SurveyCompleteion)
      .find({ where: { periodId } });
    const users = (await this.userService.getAllUsersWithInfo()).filter(
      (emp) =>
        !completeonsInPeriod.find((comp) => comp.userId === emp.employeeId),
    );
    const period = await this.surveyPeriodService.findOne(periodId);
    const administartors = await this.serviceStaffService.getAdministartors();
    for await (const user of [...users, ...administartors]) {
      const text = inviteTemplate(
        user.firstName,
        user.secondName,
        this.surveyUrl,
        period.periodName,
        new DateUtil(period.finish).getFormatedDate(),
        this.manifestUrl,
        this.myActionsUrl,
      );
      await this.sendEmail('Опрос СМК', text, [user.email]);
      await this.repository.save({ text });
    }
  }

  async sendReport(departmentName: string, periodId: number, answerId: number) {
    const text = reportSendedTemplate(
      departmentName,
      `${this.actionsUrl}?periodId=${periodId}&departmentName=${decodeURI(
        departmentName,
      )}`,
      answerId,
    );
    const administartorEmails = (
      await this.serviceStaffService.getAdministartors()
    ).map((emp) => emp.email);
    await this.sendEmail(
      'Получен отчет о выполнении КД',
      text,
      administartorEmails,
    );
    await this.repository.save({ text });
  }

  async sendReturn(sendReturnDto: SendReturnDto) {
    const responsibleList = new Set<string>();
    (
      (await this.databaseSerive.connection
        .getRepository(QuestionGroup)
        .createQueryBuilder('group')
        .leftJoin('group.responsibles', 'responsible')
        .where('group.id = ANY(:groups)', { groups: sendReturnDto.groups })
        .select('responsible.userId as "userId"')
        .getRawMany()) as { userId: string }[]
    ).forEach((user) => responsibleList.add(user.userId));

    const text = returnTemplate(this.actionsUrl);
    const emails = Array.from(responsibleList).map(
      (res) =>
        this.serviceStaffService
          .getEmployeesCached()
          .find((emp) => emp.employeeId === res).email,
    );
    await this.sendEmail('КД возвращено на доработку', text, emails);
    await this.repository.save({ text });
  }

  async sendActions(departmentName: string, periodId: number) {
    const text = actionSendedTemplate(
      departmentName,
      `${this.actionsUrl}?periodId=${periodId}&departmentName=${decodeURI(
        departmentName,
      )}`,
    );
    const administartorEmails = (
      await this.serviceStaffService.getAdministartors()
    ).map((emp) => emp.email);
    await this.sendEmail('Получены КД', text, administartorEmails);
    await this.repository.save({ text });
  }

  async sendReturningJob(
    departmentName: string,
    periodId: number,
    answerId: number,
  ) {
    const text = returnJobRecieved(
      departmentName,
      `${this.actionsUrl}?periodId=${periodId}&departmentName=${decodeURI(
        departmentName,
      )}`,
      answerId,
    );
    const administartorEmails = (
      await this.serviceStaffService.getAdministartors()
    ).map((emp) => emp.email);
    await this.sendEmail('Получены Доработки', text, administartorEmails);
    await this.repository.save({ text });
  }

  async sendReportNeeded(users: string[]) {
    const text = reportNeeded(this.actionsUrl);
    const emails = users.map(
      (res) =>
        this.serviceStaffService
          .getEmployeesCached()
          .find((emp) => emp.employeeId === res).email,
    );
    for await (const email of emails) {
      await this.sendEmail('Требуется отчет о КД', text, [email]);
      await this.repository.save({ text });
    }
  }

  private async sendEmail(
    subject: string,
    text: string,
    toRecipients: string[],
  ) {
    console.log(1);
    axios
      .post(this.emailerUrl, {
        subject,
        text,
        toRecipients,
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
