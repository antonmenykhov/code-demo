import { Controller, Get } from '@nestjs/common';
import { XlxsUploaderService } from './xlxs-uploader.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Загрузчик данных из excel')
@Controller('/xlsx-upload')
export class XlxsUploaderController {
  constructor(private readonly xlxsUploaderService: XlxsUploaderService) {}

  @Get('/contractors')
  uploadContractors() {
    return this.xlxsUploaderService.uploadContractors();
  }
}
