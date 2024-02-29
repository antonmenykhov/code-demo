import { ActionHistory } from 'src/action-history/entities/action-history.enity';
import { ActionProlongation } from 'src/action-prolongation/entities/acrion-prolongation.entity';
import { ActionState } from 'src/action-state/entities/action-state.entity';
import { Answer } from 'src/answer/entities/answer.entity';
import { File } from 'src/file/entities/file.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => Answer, (answer) => answer.correctAction)
  @JoinColumn()
  answer: Answer;
  @Column()
  answerId: number;
  @Column()
  reason: string;
  @Column()
  action: string;
  @Column()
  responsible: string;
  @Column({ type: 'timestamp' })
  dateFinish: Date;
  @Column({ type: 'timestamp', nullable: true })
  factDateFinish: Date;
  @Column({ nullable: true })
  administratorComment: string;
  @Column({ nullable: true })
  managerComment: string;
  @Column({ nullable: true })
  completeComment: string;
  @OneToMany(() => File, (file) => file.action)
  documents: File[];
  @ManyToOne(() => ActionState, (as) => as.actions)
  state: ActionState;
  @Column()
  stateId: number;
  @OneToMany(() => ActionProlongation, (ap) => ap.action)
  prolongations: ActionProlongation[];
  @OneToMany(() => ActionHistory, (ah) => ah.action)
  history: ActionHistory[];
}
