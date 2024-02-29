import { Module } from '@nestjs/common';
import { HandbookService } from './handbook.service';
import { HandbookController } from './handbook.controller';

@Module({
  controllers: [HandbookController],
  providers: [HandbookService]
})
export class HandbookModule {}
