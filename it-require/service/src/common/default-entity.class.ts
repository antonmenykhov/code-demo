import { DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @DeleteDateColumn()
  deletedAt: string;
}
