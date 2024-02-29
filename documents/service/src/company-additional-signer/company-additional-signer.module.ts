import { Module } from '@nestjs/common';
import { CompanyAdditionalSignerService } from './company-additional-signer.service';
import { CompanyAdditionalSignerController } from './company-additional-signer.controller';

@Module({
  controllers: [CompanyAdditionalSignerController],
  providers: [CompanyAdditionalSignerService],
})
export class CompanyAdditionalSignerModule {}
