import { Action } from 'src/action/entities/action.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  path: string;
  @ManyToOne(() => Action, (action) => action.documents)
  action: Action;
  @Column()
  actionId: number;
  @Column()
  fileName: string;
}
