import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ActionHistoryService } from './action-history.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('История действий')
@Controller('action-history')
export class ActionHistoryController {
  constructor(private readonly actionHistoryService: ActionHistoryService) {}

  @Get(':id')
  getByActionId(@Param('id', ParseIntPipe) id: number) {
    return this.actionHistoryService.findByAction(id);
  }
}
