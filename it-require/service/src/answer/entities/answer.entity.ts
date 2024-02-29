import { DefaultEntity } from 'src/common/default-entity.class';
import { Form } from 'src/form/entities/form.entity';
import { Question } from 'src/question/entities/question.entity';
import { Request } from 'src/request/entities/request.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Answer extends DefaultEntity {
  @Column()
  answer: string;
  @ManyToOne(() => Question, (question) => question.answers)
  question: Question[];
  @Column()
  questionId: number;
  @ManyToOne(() => Request, (req) => req.answers)
  request: Request;
  @Column()
  requestId: number;
}
