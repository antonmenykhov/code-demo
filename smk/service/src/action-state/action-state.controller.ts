import { Controller, Get, Param } from '@nestjs/common';
import { ActionStateService } from './action-state.service';

@Controller('action-state')
export class ActionStateController {
  constructor(private readonly actionStateService: ActionStateService) {}

  @Get()
  recreateStates() {
    return this.actionStateService.fill();
  }
}
