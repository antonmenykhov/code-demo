import { BaseEntity } from 'src/classes/base.entity';
import { DelegationComment } from 'src/delegation-comment/entities/delegation-comment.entity';
import { DocumentItem } from 'src/document/entities/document.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Delegation extends BaseEntity {
  @Column()
  fromId: string;
  @Column()
  toId: string;
  @ManyToOne(() => DocumentItem, (document) => document.delegations)
  document: DocumentItem;
  @Column()
  documentId: number;
  @Column()
  description: string;
  @Column({ type: 'timestamp' })
  date: string;
  @ManyToOne(() => Delegation, (delegation) => delegation.childs)
  parent: Delegation;
  @Column({ nullable: true })
  parentId: number;
  @OneToMany(() => Delegation, (delegation) => delegation.parent)
  childs: Delegation[];
  @Column({ default: false })
  isReaded: boolean;
  @UpdateDateColumn()
  updated: string;
  @CreateDateColumn()
  created: string;
  @Column({ default: false })
  isAprooved: boolean;
  @Column({ default: false })
  isNeedAprooving: boolean;
  @Column({ default: true })
  isActive: boolean;
  @OneToMany(() => DelegationComment, (comment) => comment.delegation)
  comments: DelegationComment[];
}
