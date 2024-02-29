import { BaseEntity } from 'src/classes/base.entity';
import { Company } from 'src/company/entities/company.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Email extends BaseEntity {
  @Column()
  login: string;
  @Column({ select: false })
  password: string;
  @Column()
  host: string;
  @Column()
  port: number;
  @OneToMany(() => Company, (company) => company.defaultEmail)
  companies: Company[];
}
