import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { ActionStateModule } from 'src/action-state/action-state.module';
import { ActionProlongationModule } from 'src/action-prolongation/action-prolongation.module';
import { EmailerModule } from 'src/emailer/emailer.module';
import { ActionHistoryModule } from 'src/action-history/action-history.module';

@Module({
  controllers: [ActionController],
  providers: [ActionService],
  imports: [
    DatabaseModule,
    AuthModule,
    ActionStateModule,
    ActionProlongationModule,
    EmailerModule,
    ActionHistoryModule
  ],
  exports: [ActionService],
})
export class ActionModule {}
