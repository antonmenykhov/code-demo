import { Module } from '@nestjs/common';
import { ActionProlongationService } from './action-prolongation.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [ActionProlongationService],
  imports: [DatabaseModule],
  exports: [ActionProlongationService],
})
export class ActionProlongationModule {}
