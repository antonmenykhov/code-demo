import { Module } from '@nestjs/common';
import { FileSaverService } from './file-saver.service';

@Module({
  providers: [FileSaverService],
  exports: [FileSaverService],
})
export class FileSaverModule {}
