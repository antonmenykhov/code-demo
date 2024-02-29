import { Action } from 'src/action/entities/action.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class ActionState {
  @PrimaryColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  nameForUser: string;
  @Column({ default: false })
  kdOpened: boolean;
  @Column({ default: false })
  prolongationOpened: boolean;
  @Column({ default: false })
  reportOpened: boolean;
  @Column()
  whoCanChangeState:
    | 'ADMINISTRATOR'
    | 'MANAGER'
    | 'RESPONDENT'
    | 'RESPONSIBLE'
    | 'NOBODY';
  @OneToMany(() => Action, (act) => act.state)
  actions?: Action[];
  @Column({ nullable: true })
  nextStateId?: number;
  @Column({ nullable: true })
  returnStateId?: number;
  @Column({ default: false })
  isReturnedState?: boolean;
  @Column({ default: false })
  isProlongationState?: boolean;
}
