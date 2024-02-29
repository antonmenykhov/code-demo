import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from 'src/answer/entities/answer.entity';
import { QuestionGroup } from 'src/question-group/entities/question-group.entity';
import { Question } from 'src/question/entities/question.entity';
import { SurveyCompleteion } from 'src/survey-completeion/entities/survey-completeion.entity';
import { SurveyPeriod } from 'src/survey-period/entities/survey-period.entity';
import { User } from 'src/user/entiries/user.entity';
import { DatabaseService } from './database.service';
import { Responsible } from 'src/responsible/entities/responsible.entity';
import { Action } from 'src/action/entities/action.entity';
import { File } from 'src/file/entities/file.entity';
import { ActionState } from 'src/action-state/entities/action-state.entity';
import { ActionProlongation } from 'src/action-prolongation/entities/acrion-prolongation.entity';
import { Email } from 'src/emailer/entities/email.entity';
import { ActionHistory } from 'src/action-history/entities/action-history.enity';
@Module({
  providers: [DatabaseService],
  imports: [
    TypeOrmModule.forFeature([
      User,
      SurveyPeriod,
      QuestionGroup,
      Question,
      Answer,
      SurveyCompleteion,
      Responsible,
      Action,
      File,
      ActionState,
      ActionProlongation,
      Email,
      ActionHistory
    ]),
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
