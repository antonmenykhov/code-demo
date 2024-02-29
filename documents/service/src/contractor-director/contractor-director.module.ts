import { Module } from '@nestjs/common';
import { ContractorDirectorService } from './contractor-director.service';
import { ContractorDirectorController } from './contractor-director.controller';

@Module({
  controllers: [ContractorDirectorController],
  providers: [ContractorDirectorService],
  exports: [ContractorDirectorService],
})
export class ContractorDirectorModule {}
