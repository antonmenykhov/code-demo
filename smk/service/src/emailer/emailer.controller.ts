import { Controller, Post, Body } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { SendResultsDto } from './dto/send-results-dto';
import { Roles } from 'src/auth/roles-auth.decorator';
import { SendReturnDto } from './templates/send-return.dto';

@Controller('emailer')
export class EmailerController {
  constructor(private readonly emailerService: EmailerService) {}

  @Roles(['ADMINISTRATOR'])
  @Post('/results')
  sendResults(@Body() sendResultsDto: SendResultsDto) {
    return this.emailerService.sendResults(sendResultsDto);
  }

  @Roles(['ADMINISTRATOR'])
  @Post('/returns')
  sendReturns(@Body() sendReturnsDto: SendReturnDto) {
    return this.emailerService.sendReturn(sendReturnsDto);
  }
}
