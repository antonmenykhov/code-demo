import { Controller } from '@nestjs/common';
import { PdfWorkerService } from './pdf-worker.service';

@Controller()
export class PdfWorkerController {
  constructor(private readonly pdfWorkerService: PdfWorkerService) {}
}
