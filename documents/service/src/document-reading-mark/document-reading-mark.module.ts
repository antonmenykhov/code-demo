import { Module } from '@nestjs/common';
import { DocumentReadingMarkService } from './document-reading-mark.service';

@Module({
  providers: [DocumentReadingMarkService],
  exports: [DocumentReadingMarkService],
})
export class DocumentReadingMarkModule {}
