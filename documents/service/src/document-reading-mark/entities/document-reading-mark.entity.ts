import { BaseEntity } from 'src/classes/base.entity';
import { DocumentItem } from 'src/document/entities/document.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class DocumentReadingMark extends BaseEntity {
  @Column()
  userId: string;
  @Column({ type: 'timestamp' })
  date: string;
  @ManyToOne(() => DocumentItem, (doc) => doc.readingMarks)
  document: DocumentItem;
  @Column()
  documentId: number;
  @Column({ default: false })
  withoutAnswer: boolean;
}
