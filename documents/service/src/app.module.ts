import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'node:path';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { DocumentModule } from './document/document.module';
import { ContractorModule } from './contractor/contractor.module';
import { CompanyModule } from './company/company.module';
import { Company } from './company/entities/company.entity';
import { Contractor } from './contractor/entities/contractor.entity';
import { DocumentItem } from './document/entities/document.entity';
import { AttachmentModule } from './attachment/attachment.module';
import { Attachment } from './attachment/entities/attachment.entity';
import { DelegationModule } from './delegation/delegation.module';
import { Delegation } from './delegation/entities/delegation.entity';
import { AttachmentTransformerModule } from './attachment-transformer/attachment-transformer.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import { TokenHandlerMiddleware } from './keycloak/token-handler.middleware';
import { HtmlRenderModule } from './html-render/html-render.module';
import { PdfWorkerModule } from './pdf-worker/pdf-worker.module';
import { DelegationCommentModule } from './delegation-comment/delegation-comment.module';
import { DelegationComment } from './delegation-comment/entities/delegation-comment.entity';
import { UserSignModule } from './user-sign/user-sign.module';
import { UserSign } from './user-sign/entities/user-sign.entity';
import { FileSaverModule } from './file-saver/file-saver.module';
import { FileWatcherModule } from './file-watcher/file-watcher.module';
import { ContractorDirectorModule } from './contractor-director/contractor-director.module';
import { ContractorDirector } from './contractor-director/entities/contractor-director.entity';
import { XlxsUploaderModule } from './xlxs-uploader/xlxs-uploader.module';
import { DocumentReadingMarkModule } from './document-reading-mark/document-reading-mark.module';
import { DocumentReadingMark } from './document-reading-mark/entities/document-reading-mark.entity';
import { DocumentAdditionalContractorModule } from './document-additional-contractor/document-additional-contractor.module';
import { DocumentAdditionalContractor } from './document-additional-contractor/entities/document-additional-contractor.entity';
import { CompanyAdditionalSignerModule } from './company-additional-signer/company-additional-signer.module';
import { CompanyAdditionalSigner } from './company-additional-signer/entities/company-additional-signer.entity';
import { EmailModule } from './email/email.module';
import { Email } from './email/entities/email.entity';
import { EmailerModule } from './emailer/emailer.module';
import { Emailer } from './emailer/entities/emailer.entity';
import { UserInfoModule } from './user-info/user-info.module';
import { UserInfo } from './user-info/entities/user-info.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve('public'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      entities: [
        Company,
        Contractor,
        DocumentItem,
        Attachment,
        Delegation,
        DelegationComment,
        UserSign,
        ContractorDirector,
        DocumentReadingMark,
        DocumentAdditionalContractor,
        CompanyAdditionalSigner,
        Email,
        Emailer,
        UserInfo,
      ],
      synchronize: true,
    }),
    UsersModule,
    RolesModule,
    DocumentModule,
    ContractorModule,
    CompanyModule,
    AttachmentModule,
    DelegationModule,
    AttachmentTransformerModule,
    KeycloakModule,
    HtmlRenderModule,
    PdfWorkerModule,
    DelegationCommentModule,
    UserSignModule,
    FileSaverModule,
    FileWatcherModule,
    ContractorDirectorModule,
    XlxsUploaderModule,
    DocumentReadingMarkModule,
    DocumentAdditionalContractorModule,
    CompanyAdditionalSignerModule,
    EmailModule,
    EmailerModule,
    UserInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenHandlerMiddleware)
      .exclude({
        path: '/xlsx-upload/contractors',
        method: RequestMethod.ALL,
      })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
