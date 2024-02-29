import { Controller } from '@nestjs/common';
import { ActionProlongationService } from './action-prolongation.service';

@Controller('action-prolongation')
export class ActionProlongationController {
  constructor(private readonly actionProlongationService: ActionProlongationService) {}
}
