import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { RequestStageModule } from 'src/request-stage/request-stage.module';

@Module({
  controllers: [RequestController],
  providers: [RequestService],
  imports: [RequestStageModule],
})
export class RequestModule {}
