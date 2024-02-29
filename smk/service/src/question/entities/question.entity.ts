import { Answer } from 'src/answer/entities/answer.entity';
import { OrderedEntity } from 'src/interfaces/ordered-entity';
import { QuestionGroup } from 'src/question-group/entities/question-group.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Question implements OrderedEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  text: string;
  @ManyToOne(() => QuestionGroup, (group) => group.questions, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete',
  })
  group: QuestionGroup;
  @Column()
  order: number;
  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
  @DeleteDateColumn({ select: false })
  deleted: Date;
}
