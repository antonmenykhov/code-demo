import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { KeycloakModule } from 'src/keycloak/keycloak.module';
import { PdfWorkerModule } from 'src/pdf-worker/pdf-worker.module';
import { DelegationModule } from 'src/delegation/delegation.module';
import { UserSignModule } from 'src/user-sign/user-sign.module';
import { AttachmentTransformerModule } from 'src/attachment-transformer/attachment-transformer.module';
import { FileSaverModule } from 'src/file-saver/file-saver.module';
import { DocumentReadingMarkModule } from 'src/document-reading-mark/document-reading-mark.module';
import { DocumentAdditionalContractorModule } from 'src/document-additional-contractor/document-additional-contractor.module';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService],
  imports: [
    KeycloakModule,
    PdfWorkerModule,
    DelegationModule,
    UserSignModule,
    AttachmentTransformerModule,
    FileSaverModule,
    DocumentReadingMarkModule,
    DocumentAdditionalContractorModule,
  ],
  exports: [DocumentService],
})
export class DocumentModule {}
