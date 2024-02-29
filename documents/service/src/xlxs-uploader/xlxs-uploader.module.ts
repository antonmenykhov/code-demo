import { Module } from '@nestjs/common';
import { XlxsUploaderService } from './xlxs-uploader.service';
import { XlxsUploaderController } from './xlxs-uploader.controller';
import { ContractorModule } from 'src/contractor/contractor.module';
import { ContractorDirectorModule } from 'src/contractor-director/contractor-director.module';

@Module({
  controllers: [XlxsUploaderController],
  providers: [XlxsUploaderService],
  imports: [ContractorModule, ContractorDirectorModule],
})
export class XlxsUploaderModule {}
