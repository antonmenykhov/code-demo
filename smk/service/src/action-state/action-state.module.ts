import { Module } from '@nestjs/common';
import { ActionStateService } from './action-state.service';
import { DatabaseModule } from 'src/database/database.module';
import { ActionStateController } from './action-state.controller';

@Module({
  controllers: [ActionStateController],
  providers: [ActionStateService],
  imports: [DatabaseModule],
  exports: [ActionStateService],
})
export class ActionStateModule {}
