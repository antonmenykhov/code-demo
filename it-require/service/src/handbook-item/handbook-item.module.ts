import { Module } from '@nestjs/common';
import { HandbookItemService } from './handbook-item.service';
import { HandbookItemController } from './handbook-item.controller';

@Module({
  controllers: [HandbookItemController],
  providers: [HandbookItemService]
})
export class HandbookItemModule {}
