import { Body, Controller, Post } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { CreateEmailerDto } from './dto/create-emailer.dto';
import { AccessTokenRepresentationFull } from 'src/keycloak/dto/access-token-representation-full.interface';
import { UserInfo } from 'src/users/userInfo.decorator';
import { Token } from 'src/users/token.decorator';

@Controller('emailer')
export class EmailerController {
  constructor(private readonly emailerService: EmailerService) {}

  @Post()
  sendEmail(
    @Body() createEmailerDto: CreateEmailerDto,
    @UserInfo() userInfo: AccessTokenRepresentationFull,
    @Token() token: string,
  ) {
    return this.emailerService.createEmail(createEmailerDto, userInfo, token);
  }
}
