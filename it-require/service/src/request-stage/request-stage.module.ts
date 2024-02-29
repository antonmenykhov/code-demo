import { Module } from '@nestjs/common';
import { RequestStageService } from './request-stage.service';
import { RequestStageController } from './request-stage.controller';

@Module({
  controllers: [RequestStageController],
  providers: [RequestStageService],
  exports: [RequestStageService],
})
export class RequestStageModule {}
