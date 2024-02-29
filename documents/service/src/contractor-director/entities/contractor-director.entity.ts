import { BaseEntity } from 'src/classes/base.entity';
import { Contractor } from 'src/contractor/entities/contractor.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ContractorDirector extends BaseEntity {
  @Column()
  name: string;
  @Column({ default: 'Директору' })
  formStaffName: string;
  @Column({ default: 'Иванову И.И.' })
  formFullName: string;
  @ManyToOne(() => Contractor, (contractor) => contractor.directors)
  contractor: Contractor;
  @Column()
  contractorId: number;
}
