import { Module } from '@nestjs/common';
import { DocumentAdditionalContractorService } from './document-additional-contractor.service';

@Module({
  providers: [DocumentAdditionalContractorService],
  exports: [DocumentAdditionalContractorService],
})
export class DocumentAdditionalContractorModule {}
