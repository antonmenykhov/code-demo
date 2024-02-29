import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { AttachmentTransformerModule } from 'src/attachment-transformer/attachment-transformer.module';

@Module({
  controllers: [AttachmentController],
  providers: [AttachmentService],
  imports: [AttachmentTransformerModule],
  exports: [AttachmentService],
})
export class AttachmentModule {}
