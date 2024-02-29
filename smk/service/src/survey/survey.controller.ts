import { Controller, Get } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { UserInfo } from 'src/auth/userInfo.decorator';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';
import { Roles } from 'src/auth/roles-auth.decorator';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  @Roles(['RESPONDENT'])
  getSurvey(@UserInfo() userInfo: UserInfoDto) {
    return this.surveyService.getSurveyForUser(userInfo);
  }
}
