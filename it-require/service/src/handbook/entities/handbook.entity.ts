import { DefaultEntity } from 'src/common/default-entity.class';
import { HandbookItem } from 'src/handbook-item/entities/handbook-item.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Handbook extends DefaultEntity {
  @Column()
  name: string;
  @Column()
  description: string;
  @OneToMany(() => HandbookItem, (item) => item.handbook)
  items: HandbookItem[];
}
