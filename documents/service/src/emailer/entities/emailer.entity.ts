import { BaseEntity } from 'src/classes/base.entity';
import { DocumentItem } from 'src/document/entities/document.entity';
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Emailer extends BaseEntity {
  @ManyToOne(() => DocumentItem, (document) => document.emailers)
  document: DocumentItem;
  @Column()
  documentId: number;
  @Column()
  fromEmail: string;
  @Column()
  toEmail: string;
  @Column()
  message: string;
  @Column()
  theme: string;
  @Column()
  userId: string;
  @CreateDateColumn()
  created: string;
}
