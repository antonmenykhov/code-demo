import { DefaultEntity } from 'src/common/default-entity.class';
import { Handbook } from 'src/handbook/entities/handbook.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class HandbookItem extends DefaultEntity {
  @Column()
  name: string;
  @ManyToOne(() => Handbook, (handbook) => handbook.items)
  handbook: Handbook;
  @Column()
  handbookId: number;
}
