import { Module } from '@nestjs/common';
import { AttachmentTransformerService } from './attachment-transformer.service';

@Module({
  controllers: [],
  providers: [AttachmentTransformerService],
  exports: [AttachmentTransformerService],
})
export class AttachmentTransformerModule {}
