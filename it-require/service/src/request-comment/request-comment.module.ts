import { Module } from '@nestjs/common';
import { RequestCommentService } from './request-comment.service';
import { RequestCommentController } from './request-comment.controller';

@Module({
  controllers: [RequestCommentController],
  providers: [RequestCommentService]
})
export class RequestCommentModule {}
