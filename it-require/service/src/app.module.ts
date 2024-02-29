import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KeycloakModule } from './keycloak/keycloak.module';
import { QuestionModule } from './question/question.module';
import { HandbookModule } from './handbook/handbook.module';
import { HandbookItemModule } from './handbook-item/handbook-item.module';
import { FormModule } from './form/form.module';
import { AnswerModule } from './answer/answer.module';
import { RequestModule } from './request/request.module';
import { RequestStageModule } from './request-stage/request-stage.module';
import { RolesModule } from './roles/roles.module';
import { TokenHandlerMiddleware } from './keycloak/token-handler.moddleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Handbook } from './handbook/entities/handbook.entity';
import { HandbookItem } from './handbook-item/entities/handbook-item.entity';
import { Question } from './question/entities/question.entity';
import { Form } from './form/entities/form.entity';
import { Answer } from './answer/entities/answer.entity';
import { Request } from './request/entities/request.entity';
import { RequestStage } from './request-stage/entities/request-stage.entity';
import { UsersModule } from './users/users.module';
import { RequestCommentModule } from './request-comment/request-comment.module';
import { RequestComment } from './request-comment/entities/request-comment.entity';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      entities: [
        Handbook,
        HandbookItem,
        Question,
        Form,
        Answer,
        Request,
        RequestStage,
        RequestComment,
      ],
      synchronize: true,
    }),
    KeycloakModule,
    QuestionModule,
    HandbookModule,
    HandbookItemModule,
    FormModule,
    AnswerModule,
    RequestModule,
    RequestStageModule,
    RolesModule,
    UsersModule,
    RequestCommentModule,
    ReportModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenHandlerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
