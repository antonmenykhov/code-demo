import { Controller } from '@nestjs/common';
import { FileSaverService } from './file-saver.service';

@Controller('file-saver')
export class FileSaverController {
  constructor(private readonly fileSaverService: FileSaverService) {}
}
