import { Answer } from 'src/answer/entities/answer.entity';
import { DefaultEntity } from 'src/common/default-entity.class';
import { Question } from 'src/question/entities/question.entity';
import { Request } from 'src/request/entities/request.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Form extends DefaultEntity {
  @Column()
  name: string;
  @ManyToMany(() => Question, (question) => question.forms)
  questions: Question[];
  @OneToMany(() => Request, (req) => req.form)
  requests: Request[];
}
