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
export class SurveyPeriod {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'timestamp with time zone' })
  start: Date;
  @Column({ type: 'timestamp with time zone' })
  finish: Date;
  @Column()
  periodName: string;
  @Column({ default: false })
  resultsSended: boolean;
  @OneToMany(() => Answer, (answer) => answer.period)
  answers: Answer[];
  @OneToMany(() => SurveyCompleteion, (completeion) => completeion.period)
  completions: SurveyCompleteion[];
  @DeleteDateColumn({ select: false })
  deleted: Date;
  @Column({ nullable: true, type: 'timestamp with time zone' })
  dateQuestions: Date;
  @Column({ nullable: true, type: 'timestamp with time zone' })
  dateInput: Date;
}
