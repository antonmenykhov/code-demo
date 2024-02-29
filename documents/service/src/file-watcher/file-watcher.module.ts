import { Module } from '@nestjs/common';
import { FileWatcherService } from './file-watcher.service';
import { AttachmentModule } from 'src/attachment/attachment.module';
import { DocumentModule } from 'src/document/document.module';

@Module({
  providers: [FileWatcherService],
  imports: [AttachmentModule, DocumentModule],
})
export class FileWatcherModule {}
