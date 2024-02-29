import { DefaultEntity } from 'src/common/default-entity.class';
import { Question } from 'src/question/entities/question.entity';
import { Request } from 'src/request/entities/request.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class RequestComment extends DefaultEntity {
  @Column()
  comment: string;
  @Column()
  userId: string;
  @ManyToOne(() => Request, (req) => req.comments)
  request: Request;
  @Column()
  requestId: number;
  @ManyToOne(() => Question, (question) => question.comments)
  question: Question;
  @Column()
  questionId: number;
}
