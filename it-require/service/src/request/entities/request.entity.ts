import { Answer } from 'src/answer/entities/answer.entity';
import { DefaultEntity } from 'src/common/default-entity.class';
import { Form } from 'src/form/entities/form.entity';
import { RequestComment } from 'src/request-comment/entities/request-comment.entity';
import { RequestStage } from 'src/request-stage/entities/request-stage.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Request extends DefaultEntity {
  @Column()
  userId: string;
  @ManyToOne(() => Form, (form) => form.requests)
  form: Form;
  @Column()
  formId: number;
  @OneToMany(() => Answer, (answer) => answer.request)
  answers: Answer[];
  @ManyToOne(() => RequestStage, (stage) => stage.requests)
  stage: RequestStage;
  @Column()
  stageId: number;
  @OneToMany(() => RequestComment, (comment) => comment.request)
  comments: RequestComment[];
}
