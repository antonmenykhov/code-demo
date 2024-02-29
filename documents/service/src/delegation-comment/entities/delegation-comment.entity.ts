import { BaseEntity } from 'src/classes/base.entity';
import { Delegation } from 'src/delegation/entities/delegation.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class DelegationComment extends BaseEntity {
  @Column()
  comment: string;
  @Column()
  fromId: string;
  @Column()
  delegationId: number;
  @ManyToOne(() => Delegation, (delegation) => delegation.comments)
  delegation: Delegation;
}
