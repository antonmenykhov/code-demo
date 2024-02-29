import { Action } from 'src/action/entities/action.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ActionHistory {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  date: string;
  @Column()
  event: string;
  @Column()
  userId: string;
  @ManyToOne(() => Action, (action) => action.history)
  action: Action;
  @Column()
  actionId: number;
}
