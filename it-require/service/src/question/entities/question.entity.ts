import { Answer } from 'src/answer/entities/answer.entity';
import { DefaultEntity } from 'src/common/default-entity.class';
import { Form } from 'src/form/entities/form.entity';
import { RequestComment } from 'src/request-comment/entities/request-comment.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('closure-table')
export class Question extends DefaultEntity {
  @Column()
  text: string;
  @Column({ enum: ['date', 'number', 'string', 'handbook'] })
  type: 'date' | 'number' | 'string' | 'handbook';
  @Column({ nullable: true })
  conditionParentValue: string | null;
  @Column({ nullable: true })
  handbookId: number;
  @Column()
  order: number;
  @Column({ default: false })
  isGroup: boolean;
  @TreeChildren()
  children: Question[];
  @TreeParent()
  parent: Question;
  @ManyToMany(() => Form, (form) => form.questions)
  @JoinTable()
  forms: Form[];
  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
  @OneToMany(() => RequestComment, (commnet) => commnet.question)
  comments: RequestComment[];
  @Column({ default: false })
  isRequired: boolean;
  @Column({ nullable: true })
  description: string | null;
}
