import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [UsersModule]
})
export class ReportModule {}
