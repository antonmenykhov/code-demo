import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [DatabaseModule, AuthModule],
})
export class ReportModule {}
