import { Controller, Get } from '@nestjs/common';
import { ExecuterService } from './executer.service';

@Controller('executer')
export class ExecuterController {
  constructor(private readonly executerService: ExecuterService) {}
}
