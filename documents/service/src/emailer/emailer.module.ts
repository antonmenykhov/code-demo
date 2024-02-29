import { Module } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { EmailerController } from './emailer.controller';
import { EmailModule } from 'src/email/email.module';
import { DocumentModule } from 'src/document/document.module';

@Module({
  controllers: [EmailerController],
  providers: [EmailerService],
  imports: [EmailModule, DocumentModule],
})
export class EmailerModule {}
