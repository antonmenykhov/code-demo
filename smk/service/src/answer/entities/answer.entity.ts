import { Action } from 'src/action/entities/action.entity';
import { Question } from 'src/question/entities/question.entity';
import { SurveyPeriod } from 'src/survey-period/entities/survey-period.entity';
import { User } from 'src/user/entiries/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;
  @Column()
  questionId: number;
  @Column({ nullable: true })
  numericVariant: number;
  @Column({ nullable: true })
  comment: string;
  @ManyToOne(() => User, (user) => user.answers)
  @JoinColumn({ referencedColumnName: 'userId', name: 'userId' })
  user: User;
  @ManyToOne(() => SurveyPeriod, (period) => period.answers, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete',
  })
  period: SurveyPeriod;
  @Column()
  periodId: number;
  @Column()
  userId: string;
  @DeleteDateColumn({ select: false })
  deleted: Date;
  @OneToOne(() => Action, (action) => action.answer)
  correctAction: Action;
}
