import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entiries/user.entity';
import { AnswerModule } from './answer/answer.module';
import { QuestionModule } from './question/question.module';
import { QuestionGroupModule } from './question-group/question-group.module';
import { SurveyPeriodModule } from './survey-period/survey-period.module';
import { SurveyPeriod } from './survey-period/entities/survey-period.entity';
import { QuestionGroup } from './question-group/entities/question-group.entity';
import { Question } from './question/entities/question.entity';
import { Answer } from './answer/entities/answer.entity';
import { SurveyCompleteionModule } from './survey-completeion/survey-completeion.module';
import { SurveyCompleteion } from './survey-completeion/entities/survey-completeion.entity';
import { ReportModule } from './report/report.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ServiceStaffModule } from './service-staff/service-staff.module';
import { ResponsibleModule } from './responsible/responsible.module';
import * as path from 'path';
import { Responsible } from './responsible/entities/responsible.entity';
import { SurveyModule } from './survey/survey.module';
import { ActionModule } from './action/action.module';
import { Action } from './action/entities/action.entity';
import { File } from './file/entities/file.entity';
import { ActionStateModule } from './action-state/action-state.module';
import { ActionState } from './action-state/entities/action-state.entity';
import { ActionProlongationModule } from './action-prolongation/action-prolongation.module';
import { ActionProlongation } from './action-prolongation/entities/acrion-prolongation.entity';
import { EmailerModule } from './emailer/emailer.module';
import { Email } from './emailer/entities/email.entity';
import { FileModule } from './file/file.module';
import { ExecuterModule } from './executer/executer.module';
import { ActionHistoryModule } from './action-history/action-history.module';
import { ActionHistory } from './action-history/entities/action-history.enity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.env.STORAGE),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      entities: [
        User,
        SurveyPeriod,
        QuestionGroup,
        Question,
        Answer,
        SurveyCompleteion,
        Responsible,
        Action,
        File,
        ActionState,
        ActionProlongation,
        Email,
        ActionHistory
      ],
      synchronize: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    AnswerModule,
    QuestionModule,
    QuestionGroupModule,
    SurveyPeriodModule,
    SurveyCompleteionModule,
    ReportModule,
    ServiceStaffModule,
    ResponsibleModule,
    SurveyModule,
    ActionModule,
    ActionStateModule,
    ActionProlongationModule,
    EmailerModule,
    FileModule,
    ExecuterModule,
    ActionHistoryModule,
  ],
  controllers: [],
})
export class AppModule {}
