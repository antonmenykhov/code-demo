import { SurveyPeriod } from 'src/survey-period/entities/survey-period.entity';
import { User } from 'src/user/entiries/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SurveyCompleteion {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => SurveyPeriod, (period) => period.completions)
  period: SurveyPeriod;
  @Column()
  periodId: number;
  @ManyToOne(() => User, (user) => user.completions)
  @JoinColumn({ referencedColumnName: 'userId', name: 'userId' })
  user: User;
  @Column()
  userId: string;
}
