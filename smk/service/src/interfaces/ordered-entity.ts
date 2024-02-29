import { Column } from 'typeorm';

export abstract class OrderedEntity {
  @Column()
  order: number;
}
