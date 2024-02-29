import { ApiProperty } from '@nestjs/swagger';
import { Answer } from 'src/answer/entities/answer.entity';
import { SurveyCompleteion } from 'src/survey-completeion/entities/survey-completeion.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ description: 'ID пользователя из штатки' })
  @Column({ unique: true })
  userId: string;
  @ApiProperty({ description: 'Ответы пользователя' })
  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];
  @OneToMany(() => SurveyCompleteion, (completeion) => completeion.user)
  completions: SurveyCompleteion[];
  userName: string;
  userEmail: string;
  tabNumber: string;
  @DeleteDateColumn()
  deleted: Date;
}
