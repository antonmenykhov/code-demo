import { Controller, Post } from '@nestjs/common';
import { SurveyCompleteionService } from './survey-completeion.service';
import { UserInfo } from 'src/auth/userInfo.decorator';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';
import { Roles } from 'src/auth/roles-auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('survey-completion')
@Roles()
@ApiTags('Завршение опроса')
export class SurveyCompleteionController {
  constructor(
    private readonly surveyCompleteionService: SurveyCompleteionService,
  ) {}

  @Post()
  create(@UserInfo() userInfo: UserInfoDto) {
    return this.surveyCompleteionService.create(userInfo);
  }
}
