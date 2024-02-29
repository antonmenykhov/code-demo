import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ReportService {
  constructor(private databaseService: DatabaseService) {}
}
