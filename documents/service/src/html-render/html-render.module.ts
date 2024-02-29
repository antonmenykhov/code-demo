import { Module } from '@nestjs/common';
import { HtmlRenderService } from './html-render.service';
import { HtmlRenderController } from './html-render.controller';
import { AttachmentTransformerModule } from 'src/attachment-transformer/attachment-transformer.module';
import { PdfWorkerModule } from 'src/pdf-worker/pdf-worker.module';
import { AttachmentModule } from 'src/attachment/attachment.module';

@Module({
  controllers: [HtmlRenderController],
  providers: [HtmlRenderService],
  imports: [AttachmentTransformerModule, PdfWorkerModule, AttachmentModule],
})
export class HtmlRenderModule {}
