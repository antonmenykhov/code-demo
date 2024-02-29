import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { Roles } from 'src/auth/roles-auth.decorator';

@ApiTags('Отчеты')
@Controller('report')
//@Roles('survey', ['allow-read-report'])
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
}
