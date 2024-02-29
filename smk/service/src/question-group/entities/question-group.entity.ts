import { OrderedEntity } from 'src/interfaces/ordered-entity';
import { Question } from 'src/question/entities/question.entity';
import { Responsible } from 'src/responsible/entities/responsible.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class QuestionGroup implements OrderedEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  order: number;
  @Column({ default: '' })
  departmentId: string;
  @Column({ default: false })
  disableZeroAnswers: boolean;
  @OneToMany(() => Question, (question) => question.group)
  questions: Question[];
  @OneToMany(() => Responsible, (res) => res.questionGroup)
  responsibles: Responsible[];
  @DeleteDateColumn({ select: false })
  deleted: Date;
}
