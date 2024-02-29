import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
  imports: [DatabaseModule, AuthModule]
})
export class QuestionModule {}
