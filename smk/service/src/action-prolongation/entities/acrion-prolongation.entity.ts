import { Action } from 'src/action/entities/action.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ActionProlongation {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'timestamp' })
  date: Date;
  @Column()
  reason: string;
  @ManyToOne(() => Action, (action) => action.prolongations)
  action: Action;
  @Column({ default: false })
  aprooved: boolean;
  @Column()
  actionId: number;
}
