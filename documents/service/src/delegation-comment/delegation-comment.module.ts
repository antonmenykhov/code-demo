import { Module } from '@nestjs/common';
import { DelegationCommentService } from './delegation-comment.service';
import { DelegationCommentController } from './delegation-comment.controller';
import { DelegationModule } from 'src/delegation/delegation.module';

@Module({
  controllers: [DelegationCommentController],
  providers: [DelegationCommentService],
  imports: [DelegationModule],
})
export class DelegationCommentModule {}
