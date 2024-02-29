import { Module } from '@nestjs/common';
import { ActionHistoryService } from './action-history.service';
import { ActionHistoryController } from './action-history.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ActionHistoryController],
  providers: [ActionHistoryService],
  imports: [DatabaseModule],
  exports: [ActionHistoryService],
})
export class ActionHistoryModule {}
