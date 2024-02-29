import { Controller } from '@nestjs/common';
import { FileWatcherService } from './file-watcher.service';

@Controller('file-watcher')
export class FileWatcherController {
  constructor(private readonly fileWatcherService: FileWatcherService) {}
}
