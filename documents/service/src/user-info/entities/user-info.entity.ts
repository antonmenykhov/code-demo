import { BaseEntity } from 'src/classes/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserInfo extends BaseEntity {
  @Column({ nullable: true })
  email: string;
  @Column()
  userId: string;
}
