import { QuestionGroup } from 'src/question-group/entities/question-group.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Responsible {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: string;
  @ManyToOne(() => QuestionGroup, (qg) => qg.responsibles)
  @JoinColumn()
  questionGroup: QuestionGroup;
  @Column()
  questionGroupId: number;
  userName: string;
  userEmail: string;
  tabNumber: string;
}
